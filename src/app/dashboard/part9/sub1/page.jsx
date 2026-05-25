import { midtermTemplateConfig } from '@/data/midterm-template-config';
import MidtermTemplatePage from '@/components/midterm/midterm-template-page';

export default function Page() {
  return <MidtermTemplatePage config={midtermTemplateConfig} />;
}
