import fs from 'fs';
import path from 'path';
import { MainAppContainer } from '../components/MainAppContainer';

export default function HomePage() {
  let rawJson = '';
  try {
    const jsonPath = path.join(process.cwd(), 'navigation_flow.json');
    rawJson = fs.readFileSync(jsonPath, 'utf-8');
  } catch (err) {
    console.error('Error reading navigation_flow.json:', err);
    rawJson = JSON.stringify({ error: 'navigation_flow.json not found' }, null, 2);
  }

  return <MainAppContainer rawNavigationFlowJson={rawJson} />;
}
