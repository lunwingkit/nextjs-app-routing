import { gmail_v1, google } from "googleapis";
import Schema$Message = gmail_v1.Schema$Message;
import { Buffer } from "buffer";
import moment from 'moment-timezone';
import { timeZoneHongKong } from "@/types/constants";

// const decode = (str: string): string => Buffer.from(str, 'base64').toString('binary');
const MALFORMATTED_CONTENT = "MALFORMATTED_CONTENT";
export function parseEmail(emailContent: string): PaymentRecord {

    if (emailContent == undefined || emailContent.length == 0) {
        return {
            success: false,
            errorDescription: emailContent,
            errorType: MALFORMATTED_CONTENT,
        };
    }
    const pattern = /(.+) 已過數給您。 \+ HKD (\d+\.\d{2}) (.+?) (\d{2}:\d{2}\s+\d{2}\/\d{2}\/\d{4})/;

    const match = emailContent.match(pattern);

    console.log(match);
    if (match) {
        const name = match[1];
        const amount = parseFloat(match[2]);
        const message = match[3];
        const datetime = moment.tz(match[4], 'HH:mm DD/MM/YYYY', timeZoneHongKong).toDate();

        return {
            success: true,
            payerName: name,
            amount: amount,
            time: datetime,
            message: message,
        };
    }
    else {
        return {
            success: false,
            errorDescription: emailContent,
            errorType: MALFORMATTED_CONTENT,
        };
    }
}

    //payme
    //<client> 已過數給您。 + HKD <amount> <description> <hh:mm dd/MM/yyyy> 謝謝！

    //fps
    // mail.payload?.body?.data
    // console.log(mail.snippet);

    // const raw_text = decode(mail.payload?.body?.data as string);
    // console.log(raw_text);


    //     <tbody>
    //         <tr>
    //         <td width="20" > <img src="http://www.iccmap.hsbc.com.hk/teamsite_content/iccm/HBAP/HK/user_contents/images/spacer.gif" width = "20" height = "20" > </td>
    //             < td >
    //             <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > Dear Customer: <br>
    //                 親愛的客戶：
    //     </p><br><p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;text-align: center;"><b>Fund transfer credit advice 轉賬存款通知書</b > </p><br><p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;">We've credited your account with a fund transfer. Please see the details below:<br>
    //     我們已將一筆轉賬存款存入您的戶口，詳情如下：
    //     </p><br><table cellpadding="0" cellspacing="0" border="0">
    //         < tbody >
    //         <tr>
    //         <td>
    //         <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > FPS transaction no: <br>
    //                                                                「轉數快」交易編號：
    // </p>
    //     < /td>
    //     < td valign = "top" >
    //         <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > HC12381255762190 < /p>
    //             < /td>
    //             < /tr>
    //             < tr >
    //             <td>& nbsp; </td>
    //                 <td> & nbsp; </td>
    //                     < /tr>
    //                     < tr >
    //                     <td width="220" >
    //                         <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > Payer bank / payment service provider reference no.: <br>
    //                             付款銀行／付款服務供應商參考編號：
    // </p>
    //     < /td>
    //     < td valign = "top" >
    //         <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > N81219585635 < /p>
    //             < /td>
    //             < /tr>
    //             < tr >
    //             <td>& nbsp; </td>
    //                 <td> & nbsp; </td>
    //                     < /tr>
    //                     < tr >
    //                     <td>
    //                     <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > Payment date: <br>
    //                         付款日期：
    // </p>
    //     < /td>
    //     < td valign = "top" >
    //         <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > 12 August 2023 < /p>
    //             < /td>
    //             < /tr>
    //             < tr >
    //             <td>& nbsp; </td>
    //                 <td> & nbsp; </td>
    //                     < /tr>
    //                     < tr >
    //                     <td>
    //                     <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > Payer: <br>
    //                         付款人：
    // </p>
    //     < /td>
    //     < td valign = "top" >
    //         <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > MR CHANG C ** Y *** R ****** </p>
    //             < /td>
    //             < /tr>
    //             < tr >
    //             <td>& nbsp; </td>
    //                 <td> & nbsp; </td>
    //                     < /tr>
    //                     < tr >
    //                     <td width="220" >
    //                         <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > Payer bank / payment service provider: <br>
    //                             付款銀行／付款服務供應商：
    // </p>
    //     < /td>
    //     < td valign = "top" >
    //         <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > The Hongkong and Shanghai Banking Corporation Limited < /p>
    //             < /td>
    //             < /tr>
    //             < tr >
    //             <td>& nbsp; </td>
    //                 <td> & nbsp; </td>
    //                     < /tr>
    //                     < tr >
    //                     <td>
    //                     <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > Payment amount: <br>
    //                         付款金額：
    // </p>
    //     < /td>
    //     < td valign = "top" >
    //         <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > HKD1, 500.00 < /p>
    //             < /td>
    //             < /tr>
    //             < tr >
    //             <td>& nbsp; </td>
    //                 <td> & nbsp; </td>
    //                     < /tr>
    //                     < tr >
    //                     <td>
    //                     <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > Account no.credited: <br>
    //                         存款戶口號碼：
    // </p>
    //     < /td>
    //     < td valign = "top" >
    //         <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" >033 - 467XXX - XXX < /p>
    //             < /td>
    //             < /tr>
    //             < tr >
    //             <td>& nbsp; </td>
    //                 <td> & nbsp; </td>
    //                     < /tr>
    //                     < tr >
    //                     <td width="220" >
    //                         <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > Payee Proxy ID: <br>
    //                             受款人識別代號：
    // </p>
    //     < /td>
    //     < td valign = "top" >
    //         <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > lun ***** it@gmail.com</p>
    //             < /td>
    //             < /tr>
    //             < tr >
    //             <td>& nbsp; </td>
    //                 <td> & nbsp; </td>
    //                     < /tr>
    //                     < tr >
    //                     <td>
    //                     <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > Message to recipient: <br>
    //                         給受款人的訊息：
    // </p>
    //     < /td>
    //     < td valign = "top" >
    //         <p style="font-family: arial , sans-serif , simhei;font-size: 12.0px;" > </p>
    //             < /td>
    //             < /tr>
    //             < tr >
    //             <td>& nbsp; </td>
    //                 <td> & nbsp; </td>
    //                     < /tr>
    //                     < /tbody>
    //                     < /table><br><br><p style="font-size: 12.0px;">Please log on to HSBC Internet Banking, HSBC Mobile Banking or contact our customer
    //                                                    service hotline 22333000 for details.
    //                                                 < /p><br><p style="font-size: 12.0px;">詳情請登入滙豐網上理財、滙豐流動理財或致電客戶服務熱線22333000查詢。</p > <br><br><p style= "font-family: arial , sans-serif , simhei;font-size: 12.0px;" > Yours faithfully < br > <br>
    //     The Hongkong and Shanghai Banking Corporation Limited<br>
    //                                                    香港上海滙豐銀行有限公司 謹啟
    //     < /p>
    //     < /td>
    //     < td width = "20" > <img src="http://www.iccmap.hsbc.com.hk/teamsite_content/iccm/HBAP/HK/user_contents/images/spacer.gif" width = "20" height = "20" > </>
    //         < /tr>
    //         < /tbody>

