import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface GradeRow {
  subject: string;
  mt_marks: number;
  mt_max: number;
  ex_marks: number;
  ex_max: number;
  total: number;
  total_max: number;
  grade: string;
}

interface ReportCardProps {
  schoolName: string;
  studentName: string;
  regNumber: string;
  className: string;
  academicYear: string;
  term: string;
  conduct?: number;
  conductMax?: number;
  grades: GradeRow[];
  percentage: number;
  position?: string;
  classTeacherRemarks?: string;
  principalName?: string;
  date?: string;
}

const GRADING_SCALE = [
  { range: '80-100', grade: 'A', descriptor: 'Excellent', value: 6 },
  { range: '75-79', grade: 'B', descriptor: 'Very Good', value: 5 },
  { range: '70-74', grade: 'C', descriptor: 'Good', value: 4 },
  { range: '65-69', grade: 'D', descriptor: 'Satisfactory', value: 3 },
  { range: '60-64', grade: 'E', descriptor: 'Adequate', value: 2 },
  { range: '50-59', grade: 'S', descriptor: 'Minimum Pass', value: 1 },
  { range: '0-49', grade: 'F', descriptor: 'Fail', value: 0 },
];

export const getGrade = (percentage: number): string => {
  if (percentage >= 80) return 'A';
  if (percentage >= 75) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 65) return 'D';
  if (percentage >= 60) return 'E';
  if (percentage >= 50) return 'S';
  return 'F';
};

const ReportCard = ({
  schoolName, studentName, regNumber, className, academicYear, term,
  conduct, conductMax, grades, percentage, position,
  classTeacherRemarks, principalName, date,
}: ReportCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = ref.current;
    if (!content) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>Report Card - ${studentName}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Times New Roman', serif; font-size: 12px; color: #000; }
        .report-card { max-width: 210mm; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 15px; }
        .header h2 { font-size: 14px; text-transform: uppercase; margin-bottom: 3px; }
        .header h1 { font-size: 18px; text-transform: uppercase; margin-bottom: 3px; }
        .header h3 { font-size: 16px; text-transform: uppercase; margin-bottom: 5px; border-bottom: 2px solid #000; display: inline-block; padding-bottom: 3px; }
        .info { margin-bottom: 10px; }
        .info p { margin: 2px 0; font-size: 12px; }
        .info strong { font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th, td { border: 1px solid #000; padding: 4px 6px; text-align: center; font-size: 11px; }
        th { background: #e8e8e8; font-weight: bold; }
        td.left { text-align: left; }
        .grade-scale { margin-top: 10px; }
        .grade-scale th { font-size: 10px; }
        .grade-scale td { font-size: 10px; }
        .footer { margin-top: 20px; }
        .footer p { margin: 8px 0; font-size: 11px; }
        .footer .line { border-bottom: 1px solid #000; display: inline-block; width: 200px; }
        .total-row { font-weight: bold; background: #f0f0f0; }
        .percentage { font-size: 14px; font-weight: bold; margin: 8px 0; }
        .position { font-size: 13px; margin-bottom: 10px; }
      </style></head><body>
        ${content.innerHTML}
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  const totalMarks = grades.reduce((s, g) => s + g.total, 0);
  const totalMax = grades.reduce((s, g) => s + g.total_max, 0);
  const overallGrade = getGrade(percentage);

  return (
    <div>
      <div className="flex justify-end mb-3 print:hidden">
        <Button onClick={handlePrint} size="sm" className="gap-1">
          <Printer className="w-4 h-4" /> Print Report
        </Button>
      </div>
      <div ref={ref} className="bg-white text-black p-6 rounded-lg border max-w-3xl mx-auto" style={{ fontFamily: "'Times New Roman', serif" }}>
        <div className="report-card">
          {/* Header */}
          <div className="header" style={{ textAlign: 'center', marginBottom: '15px' }}>
            <h2 style={{ fontSize: '14px', textTransform: 'uppercase', marginBottom: '3px' }}>REPUBLIC OF RWANDA</h2>
            <h2 style={{ fontSize: '14px', textTransform: 'uppercase', marginBottom: '3px' }}>MINISTRY OF EDUCATION</h2>
            <h1 style={{ fontSize: '18px', textTransform: 'uppercase', marginBottom: '8px' }}>{schoolName}</h1>
            <h3 style={{ fontSize: '16px', textTransform: 'uppercase', borderBottom: '2px solid #000', display: 'inline-block', paddingBottom: '3px' }}>PROGRESSIVE REPORT</h3>
          </div>

          {/* Student Info */}
          <div className="info" style={{ marginBottom: '10px' }}>
            <p style={{ margin: '2px 0' }}><strong>STUDENT'S NAME:</strong> {studentName}</p>
            <p style={{ margin: '2px 0' }}><strong>REGISTRATION NUMBER:</strong> {regNumber}</p>
            <p style={{ margin: '2px 0' }}><strong>CLASS:</strong> {className}</p>
            <p style={{ margin: '2px 0' }}><strong>ACADEMIC YEAR:</strong> {academicYear}</p>
            <p style={{ margin: '2px 0' }}><strong>{term}</strong></p>
          </div>

          {/* Grades Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #000', padding: '4px 6px', background: '#e8e8e8', textAlign: 'left' }}>Subject</th>
                <th style={{ border: '1px solid #000', padding: '4px 6px', background: '#e8e8e8' }}>M.T</th>
                <th style={{ border: '1px solid #000', padding: '4px 6px', background: '#e8e8e8' }}>/</th>
                <th style={{ border: '1px solid #000', padding: '4px 6px', background: '#e8e8e8' }}>EX</th>
                <th style={{ border: '1px solid #000', padding: '4px 6px', background: '#e8e8e8' }}>/</th>
                <th style={{ border: '1px solid #000', padding: '4px 6px', background: '#e8e8e8' }}>TOT</th>
                <th style={{ border: '1px solid #000', padding: '4px 6px', background: '#e8e8e8' }}>/</th>
                <th style={{ border: '1px solid #000', padding: '4px 6px', background: '#e8e8e8' }}>GRADE</th>
              </tr>
            </thead>
            <tbody>
              {conduct !== undefined && (
                <tr>
                  <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'left' }}>Conduct</td>
                  <td style={{ border: '1px solid #000', padding: '4px 6px' }}></td>
                  <td style={{ border: '1px solid #000', padding: '4px 6px' }}></td>
                  <td style={{ border: '1px solid #000', padding: '4px 6px' }}></td>
                  <td style={{ border: '1px solid #000', padding: '4px 6px' }}></td>
                  <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>{conduct}</td>
                  <td style={{ border: '1px solid #000', padding: '4px 6px' }}>{conductMax || 40}</td>
                  <td style={{ border: '1px solid #000', padding: '4px 6px' }}></td>
                </tr>
              )}
              {grades.map((g, i) => (
                <tr key={i}>
                  <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'left', textTransform: 'uppercase' }}>{g.subject}</td>
                  <td style={{ border: '1px solid #000', padding: '4px 6px' }}>{g.mt_marks}</td>
                  <td style={{ border: '1px solid #000', padding: '4px 6px' }}>{g.mt_max}</td>
                  <td style={{ border: '1px solid #000', padding: '4px 6px' }}>{g.ex_marks}</td>
                  <td style={{ border: '1px solid #000', padding: '4px 6px' }}>{g.ex_max}</td>
                  <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>{g.total}</td>
                  <td style={{ border: '1px solid #000', padding: '4px 6px' }}>{g.total_max}</td>
                  <td style={{ border: '1px solid #000', padding: '4px 6px', fontWeight: 'bold' }}>{g.grade}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', background: '#f0f0f0' }}>
                <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'left' }}>Total</td>
                <td style={{ border: '1px solid #000', padding: '4px 6px' }}>{grades.reduce((s, g) => s + g.mt_marks, 0).toFixed(1)}</td>
                <td style={{ border: '1px solid #000', padding: '4px 6px' }}>{grades.reduce((s, g) => s + g.mt_max, 0)}</td>
                <td style={{ border: '1px solid #000', padding: '4px 6px' }}>{grades.reduce((s, g) => s + g.ex_marks, 0).toFixed(1)}</td>
                <td style={{ border: '1px solid #000', padding: '4px 6px' }}>{grades.reduce((s, g) => s + g.ex_max, 0)}</td>
                <td style={{ border: '1px solid #000', padding: '4px 6px' }}>{totalMarks.toFixed(1)}</td>
                <td style={{ border: '1px solid #000', padding: '4px 6px' }}>{totalMax}</td>
                <td style={{ border: '1px solid #000', padding: '4px 6px' }}>{overallGrade}</td>
              </tr>
            </tbody>
          </table>

          {/* Percentage & Position */}
          <p className="percentage" style={{ fontSize: '14px', fontWeight: 'bold', margin: '8px 0' }}>PERCENTAGE: {percentage.toFixed(2)} %</p>
          {position && <p className="position" style={{ fontSize: '13px', marginBottom: '10px' }}>POSITION: {position}</p>}

          {/* Grading Scale */}
          <table className="grade-scale" style={{ width: '60%', borderCollapse: 'collapse', marginBottom: '15px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #000', padding: '3px 5px', background: '#e8e8e8', fontSize: '10px' }}>Percentage</th>
                <th style={{ border: '1px solid #000', padding: '3px 5px', background: '#e8e8e8', fontSize: '10px' }}>Grade</th>
                <th style={{ border: '1px solid #000', padding: '3px 5px', background: '#e8e8e8', fontSize: '10px' }}>Descriptor</th>
                <th style={{ border: '1px solid #000', padding: '3px 5px', background: '#e8e8e8', fontSize: '10px' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {GRADING_SCALE.map(s => (
                <tr key={s.grade}>
                  <td style={{ border: '1px solid #000', padding: '2px 5px', fontSize: '10px' }}>{s.range}</td>
                  <td style={{ border: '1px solid #000', padding: '2px 5px', fontSize: '10px', fontWeight: 'bold' }}>{s.grade}</td>
                  <td style={{ border: '1px solid #000', padding: '2px 5px', fontSize: '10px' }}>{s.descriptor}</td>
                  <td style={{ border: '1px solid #000', padding: '2px 5px', fontSize: '10px' }}>{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div className="footer" style={{ marginTop: '20px' }}>
            <p style={{ margin: '8px 0', fontSize: '11px' }}>Class Teacher's Remarks and Signature: {classTeacherRemarks || '___________________________'}</p>
            <p style={{ margin: '8px 0', fontSize: '11px' }}>Parent's Signature: ___________________________</p>
            {principalName && <p style={{ margin: '8px 0', fontSize: '11px', fontWeight: 'bold' }}>{principalName}</p>}
            <p style={{ margin: '8px 0', fontSize: '11px' }}>Principal</p>
            <p style={{ margin: '8px 0', fontSize: '11px' }}>{date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p style={{ margin: '8px 0', fontSize: '11px' }}>Stamp and Signature.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
