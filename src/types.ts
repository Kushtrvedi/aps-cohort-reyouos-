export type RoleId = 'TEAM_LEAD' | 'STRATEGY_LEAD' | 'RISK_LEAD' | 'COMMUNICATION_LEAD' | 'REFLECTION_LEAD';

export interface Role {
  id: RoleId;
  title: string;
  shortDescription: string;
  detailedDescription: string;
}

export interface Teammate {
  name: string;
  roleId: RoleId;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  members: Teammate[];
}

export interface UserState {
  fullName: string;
  assignedTeamId: string;
  assignedRoleId: RoleId;
  hasAgreedToOath: boolean;
  currentScreenIndex: number;
}

export const ROLES: Record<RoleId, Role> = {
  TEAM_LEAD: {
    id: 'TEAM_LEAD',
    title: 'TEAM LEAD',
    shortDescription: 'Responsible for leading the team to a final decision.',
    detailedDescription: 'Your job is to keep everyone moving forward, listen to all viewpoints, make sure we do not freeze, and click the final choice when the group is ready.',
  },
  STRATEGY_LEAD: {
    id: 'STRATEGY_LEAD',
    title: 'BIG PICTURE THINKER',
    shortDescription: 'Helps the team think about what might happen next.',
    detailedDescription: 'Your job is to look ahead. Ask: "What will this choice lead to in 5 years?" Keep the team focused on long-term safety instead of just quick, comfortable answers.',
  },
  RISK_LEAD: {
    id: 'RISK_LEAD',
    title: 'WHAT COULD GO WRONG?',
    shortDescription: 'Helps protect the team from making big mistakes.',
    detailedDescription: 'Your job is to spot the hidden dangers. Ask: "What are we ignoring?" or "What happens if this plan completely fails?" before the team votes.',
  },
  COMMUNICATION_LEAD: {
    id: 'COMMUNICATION_LEAD',
    title: 'TEAM SPEAKER',
    shortDescription: 'Explains and defends the team moves to the class.',
    detailedDescription: 'Your job is to represent the voice of the board. You will explain why we chose what we chose, and help other teams understand our perspective.',
  },
  REFLECTION_LEAD: {
    id: 'REFLECTION_LEAD',
    title: 'LESSON FINDER',
    shortDescription: 'Captures lessons and helps us learn from mistakes.',
    detailedDescription: 'Your job is to find the smart lessons from each outcome. Ask: "What did we believe that turned out to be wrong?" so we can make better decisions next time.',
  },
};

export const TEAMS: Team[] = [
  {
    id: 'TEAM_ALPHA',
    name: 'TEAM JHANSI (The Responsible Son)',
    color: 'from-amber-600 to-amber-800',
    members: [
      { name: 'Elena Rostova', roleId: 'TEAM_LEAD' },
      { name: 'Marcus Chen', roleId: 'STRATEGY_LEAD' },
      { name: 'Sarah Jenkins', roleId: 'RISK_LEAD' },
      { name: 'Devon Okafor', roleId: 'COMMUNICATION_LEAD' },
    ],
  },
  {
    id: 'TEAM_BRAVO',
    name: 'TEAM BHAGAT (The Education Loan Graduate)',
    color: 'from-indigo-600 to-indigo-800',
    members: [
      { name: 'Ananya Deshmukh', roleId: 'TEAM_LEAD' },
      { name: 'Liam O\'Connor', roleId: 'STRATEGY_LEAD' },
      { name: 'Zahra Al-Jamil', roleId: 'RISK_LEAD' },
      { name: 'Mateo Silva', roleId: 'COMMUNICATION_LEAD' },
    ],
  },
  {
    id: 'TEAM_CHARLIE',
    name: 'TEAM CHANAKYA (The Strategic Planner)',
    color: 'from-emerald-600 to-emerald-800',
    members: [
      { name: 'Siddharth Roy', roleId: 'TEAM_LEAD' },
      { name: 'Amir Patel', roleId: 'STRATEGY_LEAD' },
      { name: 'Chloe Dupont', roleId: 'RISK_LEAD' },
      { name: 'Stefan Novak', roleId: 'COMMUNICATION_LEAD' },
    ],
  },
  {
    id: 'TEAM_DELTA',
    name: 'TEAM AZAD (The Lifestyle Upgrader)',
    color: 'from-blue-600 to-blue-800',
    members: [
      { name: 'Sophia Moretti', roleId: 'STRATEGY_LEAD' },
      { name: 'Kenzo Sato', roleId: 'RISK_LEAD' },
      { name: 'Amina Diop', roleId: 'COMMUNICATION_LEAD' },
      { name: 'Lucas Fischer', roleId: 'REFLECTION_LEAD' },
    ],
  },
  {
    id: 'TEAM_ECHO',
    name: 'TEAM NETAJI (The Family Pillar)',
    color: 'from-purple-600 to-purple-800',
    members: [
      { name: 'Yusuf Demir', roleId: 'TEAM_LEAD' },
      { name: 'Clara van de Berg', roleId: 'STRATEGY_LEAD' },
      { name: 'Li Na', roleId: 'RISK_LEAD' },
      { name: 'Rajesh Kumar', roleId: 'REFLECTION_LEAD' },
    ],
  },
  {
    id: 'TEAM_FOXTROT',
    name: 'TEAM PATEL (The Stability Seeker)',
    color: 'from-teal-600 to-teal-800',
    members: [
      { name: 'Kofi Mensah', roleId: 'TEAM_LEAD' },
      { name: 'Chloe Davis', roleId: 'RISK_LEAD' },
      { name: 'Alexei Smirnov', roleId: 'COMMUNICATION_LEAD' },
      { name: 'Sana Malhotra', roleId: 'REFLECTION_LEAD' },
    ],
  },
  {
    id: 'TEAM_GOLF',
    name: 'TEAM KALAM (The Future Builder)',
    color: 'from-orange-600 to-orange-800',
    members: [
      { name: 'Hans Schmidt', roleId: 'TEAM_LEAD' },
      { name: 'Fatima Al-Sudais', roleId: 'STRATEGY_LEAD' },
      { name: 'John Smith', roleId: 'COMMUNICATION_LEAD' },
      { name: 'Isabella Bianchi', roleId: 'REFLECTION_LEAD' },
    ],
  },
  {
    id: 'TEAM_HOTEL',
    name: 'TEAM VIVEKANANDA (The Purpose Driven Professional)',
    color: 'from-cyan-600 to-cyan-800',
    members: [
      { name: 'Diego Torres', roleId: 'STRATEGY_LEAD' },
      { name: 'Natsumi Tanaka', roleId: 'RISK_LEAD' },
      { name: 'Zarah Henderson', roleId: 'COMMUNICATION_LEAD' },
      { name: 'Paul Dupont', roleId: 'REFLECTION_LEAD' },
    ],
  },
  {
    id: 'TEAM_INDIA',
    name: 'TEAM SHIVAJI (The Ambitious Achiever)',
    color: 'from-fuchsia-600 to-fuchsia-800',
    members: [
      { name: 'Ali Reza', roleId: 'TEAM_LEAD' },
      { name: 'Tariq Mahmood', roleId: 'STRATEGY_LEAD' },
      { name: 'Yuki Kobayashi', roleId: 'RISK_LEAD' },
      { name: 'Leila Haddad', roleId: 'COMMUNICATION_LEAD' },
    ],
  },
  {
    id: 'TEAM_JULIET',
    name: 'TEAM BOSE (The Opportunity Chaser)',
    color: 'from-rose-600 to-rose-800',
    members: [
      { name: 'Isabella Garcia', roleId: 'TEAM_LEAD' },
      { name: 'Yuki Takahashi', roleId: 'STRATEGY_LEAD' },
      { name: 'Arjun Mehta', roleId: 'RISK_LEAD' },
      { name: 'Fatima Al-Sayed', roleId: 'REFLECTION_LEAD' },
    ],
  },
];
