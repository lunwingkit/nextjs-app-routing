import About from "./about/page";
import { Button, ConfigProvider } from 'antd';
import theme from '@/theme/themeConfig'

export default function App() {
  return (
    <ConfigProvider theme={theme}>
      <About />
    </ConfigProvider>
  )
}
