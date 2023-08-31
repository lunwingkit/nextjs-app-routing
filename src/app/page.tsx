import React from 'react';
import { Button, ConfigProvider } from 'antd';

import theme from '@/theme/themeConfig'
import About from './about/page';

const HomePage = () => (
  <ConfigProvider theme={theme}>
    <About/>
  </ConfigProvider>
);

export default HomePage;