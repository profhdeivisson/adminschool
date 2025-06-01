import { Card, CardContent, Typography } from '@mui/material';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

const mockSkillsData = [
  { skill: 'Comunicação', value: 80 },
  { skill: 'Trabalho em Equipe', value: 90 },
  { skill: 'Liderança', value: 65 },
  { skill: 'Resolução de Problemas', value: 75 },
  { skill: 'Criatividade', value: 85 },
  { skill: 'Organização', value: 70 }
];

export default function StudentSkills() {
  return (
    <Card sx={{width: '100%'}}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Soft Skills
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={mockSkillsData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <Radar
              name="Skills"
              dataKey="value"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}