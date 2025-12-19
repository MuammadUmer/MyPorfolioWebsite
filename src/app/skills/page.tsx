import SkillsSection from '@/components/organisms/SkillsSection';
import { getSkillCategories } from '@/lib/services/content';

export default function SkillsPage() {
  const categories = getSkillCategories();
  return <SkillsSection categories={categories} />;
}
