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

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: roleData } = await adminClient.from('user_roles').select('role').eq('user_id', caller.id).single();
    if (!roleData || (roleData.role !== 'admin' && roleData.role !== 'sub_admin')) {
      return new Response(JSON.stringify({ error: 'Only admins can create staff accounts' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { email, password, full_name, employee_id, role } = await req.json();

    if (!email || !password || !full_name || !employee_id) {
      return new Response(JSON.stringify({ error: 'Missing required fields: email, password, full_name, employee_id' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const assignedRole = role || 'teacher';
    const validRoles = ['teacher', 'student', 'parent'];
    if (!validRoles.includes(assignedRole)) {
      return new Response(JSON.stringify({ error: 'Invalid role. Must be teacher, student, or parent' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Create auth user
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });

    if (createError) {
      return new Response(JSON.stringify({ error: createError.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Assign role
    await adminClient.from('user_roles').insert({ user_id: newUser.user.id, role: assignedRole });

    // Link staff record to auth user
    await adminClient.from('staff').update({ user_id: newUser.user.id }).eq('employee_id', employee_id);

    return new Response(JSON.stringify({ success: true, user_id: newUser.user.id, message: `Account created for ${full_name} with role ${assignedRole}` }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
