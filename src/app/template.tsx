'use client';
import Link from "next/link";
import { Button, Layout, Menu, Space, Drawer } from 'antd';
import { TeamOutlined, ScheduleOutlined, PhoneOutlined, CalendarOutlined, CommentOutlined, MenuOutlined, TwitterOutlined } from '@ant-design/icons';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { CustomFooter } from '@/components/footer';
import { MobileHeaderMenu } from '@/components/mobileHeader';
import { useState, } from 'react';
import RcResizeObserver from 'rc-resize-observer';
import { ErrorBoundary } from '@ant-design/pro-components';
import { HeaderMenu } from '@/components/menu';
import { TwitterLink } from "@/components/twitterLink";

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
                        {responsive ? <MobileHeaderMenu /> : <HeaderMenu />}
                    </Header>
                    <Content >
                        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                            {children}
                        </Space>
                    </Content>
                    <CustomFooter />
                </Layout>
            </RcResizeObserver>
        </ErrorBoundary >

    )
}