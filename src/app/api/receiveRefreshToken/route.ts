import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

const emptyRefreshToken = 'Not authenticated. No Refresh Token returned';

export async function GET(request: Request): Promise<Response> {
    return new Response('Hello World!');
    // console.log(request.toString());
    // console.log(request.url)
    // const refreshToken = new URLSearchParams(request.url).get("code") || emptyRefreshToken;
    // if (refreshToken !== emptyRefreshToken) {
    //     try {
    //         await prisma.googleOAuth2RefreshToken.create({
    //             data: {
    //                 refreshToken: refreshToken,
    //                 createTime: new Date(),
    //             }
    //         });
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }
    // return new Response(refreshToken);
}
