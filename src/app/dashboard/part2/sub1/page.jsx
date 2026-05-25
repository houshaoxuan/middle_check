import { midtermProjectConfigs } from '@/data/midterm-project-configs';
import MidtermTemplatePage from '@/components/midterm/midterm-template-page';

export default function Page() {
  return <MidtermTemplatePage config={midtermProjectConfigs.part2} />;
}
