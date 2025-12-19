import ExperienceTimeline from '@/components/organisms/ExperienceTimeline';
import { getExperience } from '@/lib/services/content';

export default function ExperiencePage() {
  const experience = getExperience();
  return <ExperienceTimeline items={experience} />;
}
