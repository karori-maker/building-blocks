export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string | null
          id: string
          priority: string | null
          target_class_id: string | null
          target_role: Database["public"]["Enums"]["app_role"] | null
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          priority?: string | null
          target_class_id?: string | null
          target_role?: Database["public"]["Enums"]["app_role"] | null
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          priority?: string | null
          target_class_id?: string | null
          target_role?: Database["public"]["Enums"]["app_role"] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_target_class_id_fkey"
            columns: ["target_class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_submissions: {
        Row: {
          assignment_id: string
          created_at: string | null
          feedback: string | null
          id: string
          marks: number | null
          status: string | null
          student_id: string
          submitted_at: string | null
        }
        Insert: {
          assignment_id: string
          created_at?: string | null
          feedback?: string | null
          id?: string
          marks?: number | null
          status?: string | null
          student_id: string
          submitted_at?: string | null
        }
        Update: {
          assignment_id?: string
          created_at?: string | null
          feedback?: string | null
          id?: string
          marks?: number | null
          status?: string | null
          student_id?: string
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          class_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          max_marks: number | null
          status: string | null
          subject_id: string | null
          teacher_id: string | null
          title: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          max_marks?: number | null
          status?: string | null
          subject_id?: string | null
          teacher_id?: string | null
          title: string
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          max_marks?: number | null
          status?: string | null
          subject_id?: string | null
          teacher_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          class_id: string | null
          created_at: string | null
          date: string
          id: string
          marked_by: string | null
          remarks: string | null
          status: string
          student_id: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          marked_by?: string | null
          remarks?: string | null
          status: string
          student_id: string
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          marked_by?: string | null
          remarks?: string | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      book_issues: {
        Row: {
          book_id: string
          created_at: string | null
          due_date: string | null
          fine: number | null
          id: string
          issue_date: string | null
          return_date: string | null
          status: string | null
          student_id: string
        }
        Insert: {
          book_id: string
          created_at?: string | null
          due_date?: string | null
          fine?: number | null
          id?: string
          issue_date?: string | null
          return_date?: string | null
          status?: string | null
          student_id: string
        }
        Update: {
          book_id?: string
          created_at?: string | null
          due_date?: string | null
          fine?: number | null
          id?: string
          issue_date?: string | null
          return_date?: string | null
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_issues_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "library_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_issues_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          academic_year: string
          created_at: string | null
          id: string
          name: string
          section: string
        }
        Insert: {
          academic_year?: string
          created_at?: string | null
          id?: string
          name: string
          section?: string
        }
        Update: {
          academic_year?: string
          created_at?: string | null
          id?: string
          name?: string
          section?: string
        }
        Relationships: []
      }
      discipline_incidents: {
        Row: {
          action_taken: string | null
          created_at: string | null
          date: string | null
          description: string
          id: string
          reported_by: string | null
          severity: string | null
          status: string | null
          student_id: string
        }
        Insert: {
          action_taken?: string | null
          created_at?: string | null
          date?: string | null
          description: string
          id?: string
          reported_by?: string | null
          severity?: string | null
          status?: string | null
          student_id: string
        }
        Update: {
          action_taken?: string | null
          created_at?: string | null
          date?: string | null
          description?: string
          id?: string
          reported_by?: string | null
          severity?: string | null
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discipline_incidents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          event_type: string | null
          id: string
          location: string | null
          start_date: string
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          id?: string
          location?: string | null
          start_date: string
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_type?: string | null
          id?: string
          location?: string | null
          start_date?: string
          title?: string
        }
        Relationships: []
      }
      exams: {
        Row: {
          class_id: string | null
          created_at: string | null
          date: string | null
          exam_type: string | null
          id: string
          max_marks: number | null
          name: string
          subject_id: string | null
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          date?: string | null
          exam_type?: string | null
          id?: string
          max_marks?: number | null
          name: string
          subject_id?: string | null
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          date?: string | null
          exam_type?: string | null
          id?: string
          max_marks?: number | null
          name?: string
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exams_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exams_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_payments: {
        Row: {
          amount_paid: number
          created_at: string | null
          fee_structure_id: string | null
          id: string
          payment_date: string | null
          payment_method: string | null
          receipt_number: string | null
          status: string | null
          student_id: string
        }
        Insert: {
          amount_paid: number
          created_at?: string | null
          fee_structure_id?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          status?: string | null
          student_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string | null
          fee_structure_id?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "fee_structure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_structure: {
        Row: {
          academic_year: string | null
          amount: number
          class_id: string | null
          created_at: string | null
          fee_type: string
          id: string
        }
        Insert: {
          academic_year?: string | null
          amount: number
          class_id?: string | null
          created_at?: string | null
          fee_type: string
          id?: string
        }
        Update: {
          academic_year?: string | null
          amount?: number
          class_id?: string | null
          created_at?: string | null
          fee_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_structure_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_transactions: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          created_by: string | null
          date: string | null
          description: string | null
          id: string
          type: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description?: string | null
          id?: string
          type: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description?: string | null
          id?: string
          type?: string
        }
        Relationships: []
      }
      grades: {
        Row: {
          created_at: string | null
          exam_id: string | null
          grade: string | null
          id: string
          marks_obtained: number | null
          remarks: string | null
          student_id: string
          subject_id: string | null
        }
        Insert: {
          created_at?: string | null
          exam_id?: string | null
          grade?: string | null
          id?: string
          marks_obtained?: number | null
          remarks?: string | null
          student_id: string
          subject_id?: string | null
        }
        Update: {
          created_at?: string | null
          exam_id?: string | null
          grade?: string | null
          id?: string
          marks_obtained?: number | null
          remarks?: string | null
          student_id?: string
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grades_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          item_name: string
          location: string | null
          min_quantity: number | null
          quantity: number | null
          status: string | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          item_name: string
          location?: string | null
          min_quantity?: number | null
          quantity?: number | null
          status?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          item_name?: string
          location?: string | null
          min_quantity?: number | null
          quantity?: number | null
          status?: string | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leave_applications: {
        Row: {
          applicant_id: string
          approved_by: string | null
          created_at: string | null
          end_date: string
          id: string
          leave_type: string | null
          reason: string | null
          start_date: string
          status: string | null
        }
        Insert: {
          applicant_id: string
          approved_by?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          leave_type?: string | null
          reason?: string | null
          start_date: string
          status?: string | null
        }
        Update: {
          applicant_id?: string
          approved_by?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          leave_type?: string | null
          reason?: string | null
          start_date?: string
          status?: string | null
        }
        Relationships: []
      }
      library_books: {
        Row: {
          author: string | null
          available_copies: number | null
          category: string | null
          created_at: string | null
          id: string
          isbn: string | null
          shelf_location: string | null
          title: string
          total_copies: number | null
        }
        Insert: {
          author?: string | null
          available_copies?: number | null
          category?: string | null
          created_at?: string | null
          id?: string
          isbn?: string | null
          shelf_location?: string | null
          title: string
          total_copies?: number | null
        }
        Update: {
          author?: string | null
          available_copies?: number | null
          category?: string | null
          created_at?: string | null
          id?: string
          isbn?: string | null
          shelf_location?: string | null
          title?: string
          total_copies?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          receiver_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          receiver_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      required_materials: {
        Row: {
          class_id: string | null
          created_at: string | null
          description: string | null
          id: string
          item_name: string
          subject_id: string | null
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          item_name: string
          subject_id?: string | null
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          item_name?: string
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "required_materials_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "required_materials_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      school_settings: {
        Row: {
          academic_year: string | null
          address: string | null
          email: string | null
          grading_system: string | null
          id: string
          logo_url: string | null
          phone: string | null
          school_name: string | null
          updated_at: string | null
        }
        Insert: {
          academic_year?: string | null
          address?: string | null
          email?: string | null
          grading_system?: string | null
          id?: string
          logo_url?: string | null
          phone?: string | null
          school_name?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: string | null
          address?: string | null
          email?: string | null
          grading_system?: string | null
          id?: string
          logo_url?: string | null
          phone?: string | null
          school_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          address: string | null
          created_at: string | null
          date_of_joining: string | null
          department: string | null
          designation: string | null
          email: string | null
          employee_id: string
          full_name: string
          id: string
          phone: string | null
          qualification: string | null
          salary: number | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          date_of_joining?: string | null
          department?: string | null
          designation?: string | null
          email?: string | null
          employee_id: string
          full_name: string
          id?: string
          phone?: string | null
          qualification?: string | null
          salary?: number | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          date_of_joining?: string | null
          department?: string | null
          designation?: string | null
          email?: string | null
          employee_id?: string
          full_name?: string
          id?: string
          phone?: string | null
          qualification?: string | null
          salary?: number | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      student_material_checks: {
        Row: {
          checked_at: string | null
          id: string
          is_obtained: boolean
          material_id: string
          student_id: string
        }
        Insert: {
          checked_at?: string | null
          id?: string
          is_obtained?: boolean
          material_id: string
          student_id: string
        }
        Update: {
          checked_at?: string | null
          id?: string
          is_obtained?: boolean
          material_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_material_checks_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "required_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_material_checks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          admission_date: string | null
          class_id: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          full_name: string
          gender: string | null
          id: string
          medical_info: string | null
          parent_id: string | null
          phone: string | null
          roll_number: string | null
          status: string | null
          student_id: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          admission_date?: string | null
          class_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name: string
          gender?: string | null
          id?: string
          medical_info?: string | null
          parent_id?: string | null
          phone?: string | null
          roll_number?: string | null
          status?: string | null
          student_id: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          admission_date?: string | null
          class_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          medical_info?: string | null
          parent_id?: string | null
          phone?: string | null
          roll_number?: string | null
          status?: string | null
          student_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          class_id: string | null
          code: string | null
          created_at: string | null
          id: string
          name: string
          teacher_id: string | null
        }
        Insert: {
          class_id?: string | null
          code?: string | null
          created_at?: string | null
          id?: string
          name: string
          teacher_id?: string | null
        }
        Update: {
          class_id?: string | null
          code?: string | null
          created_at?: string | null
          id?: string
          name?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subjects_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      timetable: {
        Row: {
          class_id: string | null
          created_at: string | null
          day_of_week: string
          end_time: string | null
          id: string
          period: number
          room: string | null
          start_time: string | null
          subject_id: string | null
          teacher_id: string | null
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          day_of_week: string
          end_time?: string | null
          id?: string
          period: number
          room?: string | null
          start_time?: string | null
          subject_id?: string | null
          teacher_id?: string | null
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          day_of_week?: string
          end_time?: string | null
          id?: string
          period?: number
          room?: string | null
          start_time?: string | null
          subject_id?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timetable_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_routes: {
        Row: {
          created_at: string | null
          id: string
          route_name: string
          stops: Json | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          route_name: string
          stops?: Json | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          route_name?: string
          stops?: Json | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transport_routes_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "transport_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_vehicles: {
        Row: {
          capacity: number | null
          created_at: string | null
          driver_name: string | null
          driver_phone: string | null
          id: string
          status: string | null
          vehicle_number: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          id?: string
          status?: string | null
          vehicle_number: string
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          id?: string
          status?: string | null
          vehicle_number?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "teacher" | "student" | "parent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "teacher", "student", "parent"],
    },
  },
} as const
