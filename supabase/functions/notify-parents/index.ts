import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Verify caller is admin/teacher
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: roleData } = await adminClient.from('user_roles').select('role').eq('user_id', caller.id).single();
    if (!roleData || !['admin', 'teacher'].includes(roleData.role)) {
      return new Response(JSON.stringify({ error: 'Only admins/teachers can send notifications' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { message, title, student_ids } = await req.json();

    if (!message || !title) {
      return new Response(JSON.stringify({ error: 'Missing title or message' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Get parent user IDs for the given students
    let query = adminClient.from('students').select('parent_id').not('parent_id', 'is', null);
    if (student_ids && student_ids.length > 0) {
      query = query.in('id', student_ids);
    }
    const { data: students } = await query;

    const parentIds = [...new Set((students || []).map((s: any) => s.parent_id).filter(Boolean))];

    // Also create an announcement
    await adminClient.from('announcements').insert({
      title,
      content: message,
      priority: 'high',
      target_role: 'parent',
      created_by: caller.id,
    });

    // Send in-app messages to each parent
    let sentCount = 0;
    for (const parentId of parentIds) {
      await adminClient.from('messages').insert({
        sender_id: caller.id,
        receiver_id: parentId,
        subject: title,
        content: message,
      });
      sentCount++;
    }

    return new Response(JSON.stringify({ success: true, sent_count: sentCount, message: `Notification sent to ${sentCount} parents` }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
