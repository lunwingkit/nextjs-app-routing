'use client';
import { Layout, Space } from "antd";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { useState } from "react";
import RcResizeObserver from 'rc-resize-observer';

export default function Template({ children }: { children: React.ReactNode }) {
    const [responsive, setResponsive] = useState(false);

    return (
        <ErrorBoundary>
            <RcResizeObserver
                key="resize-observer"
                onResize={(offset) => {
                    setResponsive(offset.width < 596);
                }}
            >
                <Layout>
                    <Header
                    // style={{
                    //     position: 'sticky',
                    // }}
                    >
                    </Header>
                    <Content >
                        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                            {children}
                        </Space>
                    </Content>
                    <Footer />
                </Layout>
            </RcResizeObserver>
        </ErrorBoundary >

    )
}