import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const demoUsers = [
      { email: "admin@school.com", password: "admin123", role: "admin", full_name: "John Administrator" },
      { email: "teacher@school.com", password: "teacher123", role: "teacher", full_name: "Sarah Johnson" },
      { email: "student@school.com", password: "student123", role: "student", full_name: "Alex Thompson" },
      { email: "parent@school.com", password: "parent123", role: "parent", full_name: "Maria Thompson" },
    ];

    const results = [];

    for (const user of demoUsers) {
      // Check if user exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((u: any) => u.email === user.email);
      
      let userId: string;
      if (existing) {
        userId = existing.id;
        results.push({ email: user.email, status: "exists", userId });
      } else {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: { full_name: user.full_name },
        });
        if (error) {
          results.push({ email: user.email, status: "error", error: error.message });
          continue;
        }
        userId = data.user.id;
        results.push({ email: user.email, status: "created", userId });
      }

      // Upsert role
      await supabaseAdmin.from("user_roles").upsert(
        { user_id: userId, role: user.role },
        { onConflict: "user_id,role" }
      );
    }

    // Now seed demo data using the user IDs
    const adminId = results.find(r => r.email === "admin@school.com")?.userId;
    const teacherId = results.find(r => r.email === "teacher@school.com")?.userId;
    const studentUserId = results.find(r => r.email === "student@school.com")?.userId;
    const parentId = results.find(r => r.email === "parent@school.com")?.userId;

    // Seed classes
    const classesData = [
      { name: "Grade 8", section: "A" }, { name: "Grade 8", section: "B" },
      { name: "Grade 9", section: "A" }, { name: "Grade 9", section: "B" },
      { name: "Grade 10", section: "A" }, { name: "Grade 10", section: "B" },
    ];
    
    const { data: existingClasses } = await supabaseAdmin.from("classes").select("id");
    if (!existingClasses?.length) {
      await supabaseAdmin.from("classes").insert(classesData);
    }

    const { data: classes } = await supabaseAdmin.from("classes").select("*");
    const class10A = classes?.find((c: any) => c.name === "Grade 10" && c.section === "A");
    const class9A = classes?.find((c: any) => c.name === "Grade 9" && c.section === "A");

    // Seed subjects
    const { data: existingSubjects } = await supabaseAdmin.from("subjects").select("id");
    if (!existingSubjects?.length && class10A && class9A) {
      await supabaseAdmin.from("subjects").insert([
        { name: "Mathematics", code: "MATH10", class_id: class10A.id, teacher_id: teacherId },
        { name: "English", code: "ENG10", class_id: class10A.id },
        { name: "Science", code: "SCI10", class_id: class10A.id },
        { name: "History", code: "HIS10", class_id: class10A.id },
        { name: "Mathematics", code: "MATH9", class_id: class9A.id, teacher_id: teacherId },
        { name: "English", code: "ENG9", class_id: class9A.id },
      ]);
    }

    // Seed students
    const { data: existingStudents } = await supabaseAdmin.from("students").select("id");
    if (!existingStudents?.length && class10A && class9A) {
      await supabaseAdmin.from("students").insert([
        { user_id: studentUserId, student_id: "STU001", roll_number: "1", class_id: class10A.id, full_name: "Alex Thompson", gender: "male", parent_id: parentId, email: "student@school.com" },
        { student_id: "STU002", roll_number: "2", class_id: class10A.id, full_name: "Emily Carter", gender: "female" },
        { student_id: "STU003", roll_number: "3", class_id: class10A.id, full_name: "James Wilson", gender: "male" },
        { student_id: "STU004", roll_number: "4", class_id: class10A.id, full_name: "Sophia Lee", gender: "female" },
        { student_id: "STU005", roll_number: "5", class_id: class9A.id, full_name: "Liam Brown", gender: "male" },
        { student_id: "STU006", roll_number: "6", class_id: class9A.id, full_name: "Olivia Davis", gender: "female" },
        { student_id: "STU007", roll_number: "7", class_id: class9A.id, full_name: "Noah Martinez", gender: "male" },
        { student_id: "STU008", roll_number: "8", class_id: class10A.id, full_name: "Ava Garcia", gender: "female" },
      ]);
    }

    // Seed staff
    const { data: existingStaff } = await supabaseAdmin.from("staff").select("id");
    if (!existingStaff?.length) {
      await supabaseAdmin.from("staff").insert([
        { user_id: teacherId, employee_id: "EMP001", full_name: "Sarah Johnson", designation: "Senior Teacher", department: "Mathematics", qualification: "M.Sc Mathematics", email: "teacher@school.com", salary: 55000 },
        { employee_id: "EMP002", full_name: "Michael Davis", designation: "Teacher", department: "English", qualification: "M.A English", salary: 48000 },
        { employee_id: "EMP003", full_name: "Lisa Wang", designation: "Teacher", department: "Science", qualification: "M.Sc Physics", salary: 50000 },
        { employee_id: "EMP004", full_name: "Robert Brown", designation: "Librarian", department: "Library", qualification: "B.Lib", salary: 35000 },
        { employee_id: "EMP005", full_name: "Jennifer Adams", designation: "Accountant", department: "Finance", qualification: "B.Com", salary: 40000 },
      ]);
    }

    // Seed library books
    const { data: existingBooks } = await supabaseAdmin.from("library_books").select("id");
    if (!existingBooks?.length) {
      await supabaseAdmin.from("library_books").insert([
        { title: "Introduction to Algebra", author: "James Stewart", isbn: "978-0321830", total_copies: 5, available_copies: 3, shelf_location: "A1", category: "Mathematics" },
        { title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "978-0061120", total_copies: 8, available_copies: 6, shelf_location: "B2", category: "Literature" },
        { title: "Physics Fundamentals", author: "David Halliday", isbn: "978-0470046", total_copies: 4, available_copies: 4, shelf_location: "A3", category: "Science" },
        { title: "World History", author: "William Duiker", isbn: "978-1305091", total_copies: 6, available_copies: 5, shelf_location: "C1", category: "History" },
      ]);
    }

    // Seed inventory
    const { data: existingInventory } = await supabaseAdmin.from("inventory").select("id");
    if (!existingInventory?.length) {
      await supabaseAdmin.from("inventory").insert([
        { item_name: "Printer Paper (Ream)", category: "Office Supplies", quantity: 3, min_quantity: 10, unit_price: 8.50, location: "Store Room A" },
        { item_name: "Whiteboard Markers", category: "Classroom", quantity: 5, min_quantity: 20, unit_price: 2.50, location: "Store Room B" },
        { item_name: "Lab Equipment Set", category: "Science Lab", quantity: 8, min_quantity: 5, unit_price: 150, location: "Lab Storage" },
        { item_name: "Sports Balls", category: "Sports", quantity: 15, min_quantity: 10, unit_price: 25, location: "Sports Room" },
        { item_name: "First Aid Kits", category: "Medical", quantity: 4, min_quantity: 3, unit_price: 45, location: "Nurse Office" },
      ]);
    }

    // Seed transport
    const { data: existingVehicles } = await supabaseAdmin.from("transport_vehicles").select("id");
    if (!existingVehicles?.length) {
      await supabaseAdmin.from("transport_vehicles").insert([
        { vehicle_number: "SCH-001", driver_name: "Tom Harris", driver_phone: "+1-555-0201", capacity: 40 },
        { vehicle_number: "SCH-002", driver_name: "Mike Chen", driver_phone: "+1-555-0202", capacity: 35 },
      ]);
    }

    // Seed events
    const { data: existingEvents } = await supabaseAdmin.from("events").select("id");
    if (!existingEvents?.length) {
      await supabaseAdmin.from("events").insert([
        { title: "Annual Sports Day", description: "Inter-class sports competition", event_type: "sports", start_date: "2026-03-15", location: "School Ground", created_by: adminId },
        { title: "Parent-Teacher Meeting", description: "Mid-term progress discussion", event_type: "academic", start_date: "2026-03-20", location: "Auditorium", created_by: adminId },
        { title: "Science Fair", description: "Student science project exhibition", event_type: "academic", start_date: "2026-04-05", location: "Main Hall", created_by: adminId },
      ]);
    }

    // Seed announcements
    const { data: existingAnnouncements } = await supabaseAdmin.from("announcements").select("id");
    if (!existingAnnouncements?.length) {
      await supabaseAdmin.from("announcements").insert([
        { title: "Mid-term Exam Schedule", content: "Mid-term examinations will begin from March 10. Please check the timetable for your schedule.", created_by: adminId, priority: "high" },
        { title: "Library Hours Extended", content: "The library will remain open until 6 PM starting next week.", created_by: adminId },
        { title: "Staff Meeting", content: "All staff are requested to attend the meeting on Friday at 3 PM.", target_role: "teacher", created_by: adminId },
      ]);
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
