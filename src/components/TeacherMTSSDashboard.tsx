import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { sounds } from '../utils/audio';
import { 
  Users, 
  Layers, 
  Activity, 
  FileSpreadsheet, 
  Send, 
  ShieldAlert, 
  CheckCircle, 
  ArrowLeft,
  X,
  Plus,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface StudentRosterItem {
  id: string;
  name: string;
  grade: string;
  tier: 'Tier 1 (Universal)' | 'Tier 2 (Targeted)' | 'Tier 3 (Intensive)' | 'Gifted (2e)';
  wcpm: number;
  accuracy: number;
  focusSkill: string;
  hasIEP: boolean;
}

const MOCK_CLASS_ROSTER: StudentRosterItem[] = [
  { id: 'st-1', name: 'Kamden R.', grade: 'Grade 1', tier: 'Tier 1 (Universal)', wcpm: 64, accuracy: 96, focusSkill: 'Consonant Digraphs', hasIEP: false },
  { id: 'st-2', name: 'Zuri M.', grade: 'Grade 2', tier: 'Tier 2 (Targeted)', wcpm: 72, accuracy: 89, focusSkill: 'Vowel Teams (ai/ay)', hasIEP: true },
  { id: 'st-3', name: 'Landry B.', grade: 'Kindergarten', tier: 'Tier 1 (Universal)', wcpm: 28, accuracy: 98, focusSkill: 'CVC Short Vowels', hasIEP: false },
  { id: 'st-4', name: 'Joleigh S.', grade: 'Grade 1', tier: 'Tier 3 (Intensive)', wcpm: 38, accuracy: 79, focusSkill: 'Phonemic Slicing', hasIEP: true },
  { id: 'st-5', name: 'Amari W.', grade: 'Grade 5', tier: 'Gifted (2e)', wcpm: 165, accuracy: 99, focusSkill: 'Greek Morphology', hasIEP: false }
];

interface TeacherMTSSDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherMTSSDashboard: React.FC<TeacherMTSSDashboardProps> = ({
  isOpen,
  onClose
}) => {
  const [students, setStudents] = useState<StudentRosterItem[]>(MOCK_CLASS_ROSTER);
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('All');
  const [assignedMessage, setAssignedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredStudents = selectedTierFilter === 'All' 
    ? students 
    : students.filter((s) => s.tier.includes(selectedTierFilter));

  const handleDispatchAssignment = (assignmentTitle: string) => {
    sounds.playSuccess();
    setAssignedMessage(`Dispatched "${assignmentTitle}" to ${filteredStudents.length} active students!`);
    setTimeout(() => setAssignedMessage(null), 3500);
  };

  const handleExportCSV = () => {
    sounds.playClick();
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Grade,MTSS Tier,WCPM,Accuracy %,Focus Skill,IEP Status\n"
      + students.map(s => `"${s.name}","${s.grade}","${s.tier}",${s.wcpm},${s.accuracy}%,"${s.focusSkill}","${s.hasIEP ? 'Yes' : 'No'}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "phonixia_mtss_roster_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in select-none">
      <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-emerald-400/80 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xl">
              🍎
            </div>
            <div>
              <h2 className="text-xl font-black text-emerald-200 tracking-wide font-display flex items-center gap-2">
                Teacher &amp; MTSS / RTI Command Center
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  School District Portal
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Tier 1 Universal • Tier 2 Targeted Small Group • Tier 3 Intensive Clinical Dyslexia Intervention
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* MTSS Tier Filters */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold mr-1">Filter Tier:</span>
            {['All', 'Tier 1', 'Tier 2', 'Tier 3', 'Gifted'].map((t) => (
              <button
                key={t}
                onClick={() => {
                  sounds.playClick();
                  setSelectedTierFilter(t);
                }}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  selectedTierFilter === t
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Quick Assignment Dispatch */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDispatchAssignment('Builders Guild: CVCe Silent-E Blitz')}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-bold transition flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              Assign Phonics Blitz
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 font-bold transition flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export District CSV
            </button>
          </div>
        </div>

        {/* Assigned Notification Banner */}
        {assignedMessage && (
          <div className="px-6 py-2 bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{assignedMessage}</span>
          </div>
        )}

        {/* Roster Table */}
        <div className="p-6 overflow-y-auto flex-1 text-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase text-slate-400 font-mono">
                <th className="pb-3">Student Name</th>
                <th className="pb-3">Grade Level</th>
                <th className="pb-3">MTSS Tier</th>
                <th className="pb-3">WCPM Fluency</th>
                <th className="pb-3">Phonemic Accuracy</th>
                <th className="pb-3">Science of Reading Focus</th>
                <th className="pb-3">IEP/504</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-slate-200">{st.name}</td>
                  <td className="py-3 text-slate-400">{st.grade}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      st.tier.includes('Tier 3')
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                        : st.tier.includes('Tier 2')
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                        : st.tier.includes('Gifted')
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                    }`}>
                      {st.tier}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-cyan-300">{st.wcpm} WCPM</td>
                  <td className="py-3 font-mono font-bold text-emerald-300">{st.accuracy}%</td>
                  <td className="py-3 text-slate-300">{st.focusSkill}</td>
                  <td className="py-3">
                    {st.hasIEP ? (
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 font-bold text-[10px]">
                        Active Plan
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Gen Ed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Active MTSS Interventions follow Structured Literacy &amp; Orton-Gillingham frameworks.</span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
