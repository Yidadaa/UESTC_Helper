import dva from 'dva';
import './index.less';
import 'antd/dist/antd.css';

// Models
const models = [
  require('./models/report')
];

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Models
models.forEach(model => {
  app.model(model);
});

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
