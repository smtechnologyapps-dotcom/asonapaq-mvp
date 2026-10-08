const fs = require('fs');
let panel = fs.readFileSync('components/views/PanelAdministracionView.tsx', 'utf8');

panel = panel.replace(/import \{ ClipboardList, Filter, FileSpreadsheet, PieChart as PieChartIcon, BarChart3, Map, Users, Activity, HeartHandshake, X \} from 'lucide-react';/, "import { ClipboardList, Filter, FileSpreadsheet, PieChart as PieChartIcon, BarChart3, Map, Users, Activity, HeartHandshake, X, User, Heart } from 'lucide-react';");

fs.writeFileSync('components/views/PanelAdministracionView.tsx', panel, 'utf8');
