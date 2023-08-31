'use client';
import Link from "next/link";
import { LoginOutlined, LogoutOutlined, TeamOutlined, ScheduleOutlined, PhoneOutlined, CalendarOutlined, CommentOutlined, TwitterOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Image, Menu } from 'antd';
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import { Header } from "antd/es/layout/layout";
import { TwitterLink } from "./twitterLink";
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export function HeaderMenu() {
    // const router = useRouter();
    // const pathname = usePathname();
    // const navigateTo = (route: string) => {
    //     console.log(pathname);
    //     console.log(route);
    //     if (pathname == route)
    //         // router.refresh();
    //         location.reload();
    //     else {
    //         router.push(route);
    //     }
    // }
    const { data: session } = useSession();
    const account = ` Welcome back❤ ${session?.user?.name}`;
    return (
        <ErrorBoundary>
            <Menu
                theme="dark"
                // defaultSelectedKeys={['1']}
                // onClick={onClick}
                // selectedKeys={[current]}
                mode='horizontal'
                style={{ display: 'flex', justifyContent: 'center' }}
            // items={items}
            >
                <Menu.Item
                    key="about"
                    icon={<TeamOutlined />}
                    // onClick={() => navigateTo('/')}
                // style={centerStyle}
                >
                    <Link href="/about" >
                    About Us
                    </Link>
                </Menu.Item>
                <Menu.Item
                    key="checkout"
                    icon={<CalendarOutlined />}
                    // onClick={() => navigateTo('/checkout')}
                >
                    <Link href="/checkout">
                    Make a booking!
                    </Link>
                </Menu.Item>
                {session && <Menu.SubMenu
                    key="userSubMenu"
                    title={account}
                    icon={<Image src={session?.user?.image || ""}
                        alt=""
                        height={15} width={15}
                        preview={false}
                    />}
                >
                    <Menu.Item
                        key="userReservation"
                        // onClick={() => navigateTo('/userReservation')}
                    >
                        <Link href="/userReservation">
                        Manage My Reservation
                        </Link>
                    </Menu.Item>
                    <Menu.Item
                        key="userEvent"
                        // onClick={() => navigateTo('/userEvent')}
                    >
                        <Link href="/userEvent">
                        See Event Attended
                        </Link>
                    </Menu.Item>
                </Menu.SubMenu>}
                {session ?
                    (<Menu.Item key="signout" >
                        <Button icon={<LogoutOutlined />} onClick={() => signOut()}>Sign out</Button>
                    </Menu.Item>) :
                    (<Menu.Item key="signin" >
                        <Button icon={<LoginOutlined />} onClick={() => signIn()}>Sign in</Button>
                    </Menu.Item>)
                }
                <Menu.Item
                    key="redirectTwitter"
                >
                    <TwitterLink />
                </Menu.Item>
                {/* <MenuItemAbout/>
                <MenuItemCheckOut/>
                <AccountButton />
                <LoginButton /> */}
            </Menu>
        </ErrorBoundary>
    );
}