'use client';
import { Alert } from "antd";
import { useSession } from "next-auth/react";

export default function NoLoginAlertComponent() {
    const { data: session } = useSession();

    return (
        session ?
        null : 
        <Alert
            message="建議先以Google/Twitter登入 登入後可檢視/修改過往訂單"
            banner
            closable
        />
    )
}