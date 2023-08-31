// 'use client';
// import Link from "next/link";
// import { LoginOutlined, LogoutOutlined, PlusOutlined, TeamOutlined, ScheduleOutlined, PhoneOutlined, CalendarOutlined, CommentOutlined, TwitterOutlined } from '@ant-design/icons';
// import type { MenuProps } from 'antd';
// import { Button, Image, Menu } from 'antd';
// import ErrorBoundary from "antd/es/alert/ErrorBoundary";
// import { Header } from "antd/es/layout/layout";
// import { TwitterLink } from "./twitterLink";
// import { useSession, signOut, signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export const MenuItemAbout = () => {

//     return (
//         <Menu.Item
//             key="about"
//             icon={<TeamOutlined />}
//         // style={centerStyle}
//         >
//             <Link href="/about" >
//                 About Us
//             </Link>
//         </Menu.Item>
//     );
// }

// export const MenuItemCheckOut = () => {
//     return (
//         <Menu.Item
//             key="checkout"
//             icon={<CalendarOutlined />}
//         >
//             <Link href="/checkout">
//                     Make a booking!
//             </Link>
//         </Menu.Item>
//     );
// }

// export function AccountButton() {

//     const { data: session } = useSession();
//     const account = ` Welcome back❤ ${session?.user?.name}`;
//     if (session) {
//         return (
//             <Menu.SubMenu
//                 key="userSubMenu"
//                 title={account}
//                 icon={<Image src={session?.user?.image || ""}
//                     alt=""
//                     height={15} width={15}
//                     preview={false}
//                 />}
//             >
//                 <Menu.Item
//                     key="userReservation"
//                 >
//                     <Link href="/userReservation">
//                         Manage My Reservation
//                     </Link>
//                 </Menu.Item>
//                 <Menu.Item
//                     key="userEvent"
//                 >
//                     <Link href="/userEvent">
//                         See Event Attended
//                     </Link>
//                 </Menu.Item>
//             </Menu.SubMenu>
//         )
//     }
//     else {
//         return (
//             <></>
//         )
//     }
// }

// export function LoginButton() {
//     const { data: session } = useSession()
//     if (session) {
//         return (
//             <Menu.Item key="signout" >
//                 <Button icon={<LogoutOutlined />} onClick={() => signOut()}>Sign out</Button>
//             </Menu.Item>
//         )
//     }
//     return (
//         <Menu.Item key="signin" >
//             <Button icon={<LoginOutlined />} onClick={() => signIn()}>Sign in</Button>
//         </Menu.Item>
//     )
// }