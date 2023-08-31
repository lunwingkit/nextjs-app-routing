'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Card, Space, Select, Form, Input, Checkbox, Button, Divider, InputRef, Tooltip, Result, List, Typography, message } from "antd";
import { PlusOutlined, MinusCircleOutlined, TwitterOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import RcResizeObserver from 'rc-resize-observer';
import type { RangePickerProps } from 'antd/es/date-picker';
import Image from 'next/image';

import {
    ProCard,
    ProDescriptions,
    ProForm,
    ProFormDateTimeRangePicker,
    ProFormDigit,
    ProFormInstance,
    StepsForm,
} from '@ant-design/pro-components';
import dayjs, { Dayjs } from "dayjs";
import localeDatePicker from 'antd/es/date-picker/locale/zh_TW';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { timeZoneHongKong, } from '@/types/constants';
import { ResultStatusType, } from 'antd/es/result';

// import global from '@/css/styles.module.css';
const { Title } = Typography;
dayjs.extend(utc)
dayjs.extend(timezone)

const CardPaymentQR = () => {
    return (
        <Card
            bordered={false}
        >
            <Image
                width={200}
                height={200}
                src="/assets/qrcode_payme.png"
                alt="payme-qr-code"
            />
            <Divider
            // style={{
            //     margin: '0 0 24 0'
            // }}
            />
            <Button
                href="https://www.github.com/"
                target="_blank"
            >
                Payme連結
            </Button>
        </Card>
    );
}

const headCount = "headCount";
const bookingDateTime = "bookingDateTime";
const extraService = "extraService";
const domService = "domService";
const specialEquipment = "specialEquipment";
const domFee = "domFee";
const deposit = "deposit";
const hourlyRate = "hourlyRate";
const domServiceCN = '加主人調教';
const payme = 'payme';
const fps = 'fps';
const optionsContact = [
    'Whatsapp',
    'Twitter',
    'Instagram',
    'Wechat',
    'Telegram',
];

const mapExtraService = {
    domService: domServiceCN,
    specialEquipment: "特別器材(+$300)",
}

const mapItemKeyName = {
    hourlyRate: '鐘點費用',
    domFee: domServiceCN,
    specialEquipment: '特殊道具',
    deposit: '按金',

}
const optionsExtraService = [
    { label: mapExtraService[domService], value: domService, tooltipTitle: '最低收費$300/小時 詳情請向Twitter專頁PM查詢', },
    { label: mapExtraService[specialEquipment], value: specialEquipment, tooltipTitle: '+$300以使用狗籠、真空櫃、真空床等設備', },
    // { label: 'CB鎖', value: 'CB鎖', tooltipTitle: '+$50以提供CB鎖租借服務並永久保管鎖匙', },
]

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const overrideAntProStepsFormContainer: React.CSSProperties = {
    minWidth: '0px',
}

interface Props {
    mapYYYYMMDD2DisbledHours: Map<number, number[]>; // Define the prop type
}

const MultiStepForm: React.FC<Props> = ({ mapYYYYMMDD2DisbledHours }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [responsive, setResponsive] = useState(false);
    const [priceData, setPriceData] = useState([
        { key: hourlyRate, name: mapItemKeyName[hourlyRate], description: "", price: 0 },
        { key: specialEquipment, name: mapItemKeyName[specialEquipment], description: "", price: 0 },
        { key: domFee, name: mapItemKeyName[domFee], description: "", price: 0 },
        { key: deposit, name: mapItemKeyName[deposit], description: "(如無任何道具損毀／場地清潔問題，將於借用房間後2小時內退還)", price: 500 },
    ] as { key: string, name: string, description: string, price: number }[]);

    const [priceSum, setPriceSum] = useState(0);
    const [paymentResult, setPaymentResult] = useState("success");
    const [loadings, setLoadings] = useState<boolean[]>([]);
    const [disableds, setDisableds] = useState<boolean[]>([]);

    interface FormFields {
        bookingDateTime?: any[],
        headCount?: number,
        extraService?: any[],
        contactMethod?: any[],
    }
    const [formFields, setFormFields] = useState<FormFields>({
        contactMethod: [{}]
    });

    const formRef = useRef<ProFormInstance>();
    const [items, setItems] = useState(optionsContact);
    const [name, setName] = useState('');
    // const [paymentMethodSelected, setPaymentMethodSelected] = useState(payme);
    const inputRef = useRef<InputRef>(null);
    let index = 0;

    const fetchPaymentRecordFrom = new Date().getTime();
    useEffect(() => {
    }, []);
    useEffect(() => {
        setPriceSum(_ => {
            let temp = 0;
            priceData.forEach((data) => {
                temp += data.price;
            })
            return temp;
        });
    }, [priceData]);

    const messagePaymentSuccess = () => {
        messageApi.open({
            type: 'success',
            content: '付款已確認！',
        });
    };

    const messagePaymentError = () => {
        messageApi.open({
            type: 'error',
            content: '尚未能確認付款',
        });
    }
    const updatePaymentResult = (result: PaymentVerification) => {
        setPaymentResult(result.success);
        console.log(result.success);
        if (result.success == 'success') {
            messagePaymentSuccess();
        }
        else {
            messagePaymentError();
        }
    }

    const updateLoading = (idx: number, isLoading: boolean) => {
        if (idx == 1) {
            setDisableds((prevDisabled) => {
                const newDisableds = [...prevDisabled];
                newDisableds[idx] = isLoading;
                return newDisableds;
            })
        }
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[idx] = isLoading;
            return newLoadings;
        })
    }

    const ListPaymentLumpSum = () => {
        return (
            <List
                style={{ width: '100%' }}
                size="small"
                header={<div style={{ display: 'flex', justifyContent: 'space-between', }}>
                    <Typography style={{ alignSelf: 'flex-start' }}>項目明細</Typography>
                    <Typography style={{ alignSelf: 'flex-end' }}>價格</Typography>
                </div>}
                footer={(<div style={{ display: 'flex', justifyContent: 'space-between', }}>
                    <div style={{ alignSelf: 'flex-start' }}>款項</div>
                    <div style={{ alignSelf: 'flex-end' }}>{`🇭🇰💲${priceSum}`}</div>
                </div>)}
                bordered
                dataSource={priceData}
                renderItem={(item: { key: string, name: string, description: string, price: number }) => (
                    item.price > 0 &&
                    <List.Item>
                        <div style={{ textAlign: 'left', width: '70%' }}>{`${item.name} ${item.description}`}</div>
                        <div style={{ textAlign: 'right', width: '30%' }}>{item.price}</div>
                    </List.Item>
                )}
            />
        );
    }

    const [passwordVisible, setPasswordVisible] = React.useState(false);

    const ListContactMethod = () => {
        return (
            <List
                style={{ width: '100%' }}
                size="small"
                header={
                    <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                        <Typography style={{ alignSelf: 'flex-start' }}>聯絡途徑</Typography>
                        <Typography style={{ alignSelf: 'flex-end' }}>ID</Typography>
                    </div>
                }
                bordered
                dataSource={formFields.contactMethod}
                renderItem={(item: { channel: string, contactId: string }) => (
                    <List.Item >
                        <div style={{ textAlign: 'left', width: '30%' }}>{item.channel}</div>
                        <div style={{ textAlign: 'right', width: '70%' }}>{item.contactId}</div>
                    </List.Item>
                )}
            />
        );
    };

    const OrderOverview = () => {
        return (
            <ProDescriptions
                column={1}
                title="訂單概要"
                tooltip="m"
            >

                <ProDescriptions.Item
                    label="日期時間"
                    valueType="dateTimeRange"
                >
                    {formFields.bookingDateTime && [formFields.bookingDateTime[0], formFields.bookingDateTime[1]]}
                    {/* {formRef.current?.getFieldValue(bookingDateTime) && [formRef.current?.getFieldValue(bookingDateTime)[0], formRef.current?.getFieldValue(bookingDateTime)[1]]} */}
                </ProDescriptions.Item>

                <ProDescriptions.Item
                    label="人數"
                    valueType="digit"
                >
                    {formFields.headCount}
                    {/* {formRef.current?.getFieldValue(headCount)} */}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    label="附加項目"
                    valueType="group"
                >
                    <Checkbox.Group
                        options={optionsExtraService.map((service) => {
                            return { label: service.label, value: service.value };
                        })}
                        disabled={true}
                        value={formFields.extraService}
                    // value={formRef.current?.getFieldValue(extraService)}
                    />
                </ProDescriptions.Item>

                <ProDescriptions.Item
                    label="細項"
                >
                    <ListPaymentLumpSum />
                </ProDescriptions.Item>
                <ProDescriptions.Item
                    label="聯絡方式"
                >
                    <ListContactMethod />
                </ProDescriptions.Item>
            </ProDescriptions>
        );
    }
    async function confirmPayment(from: number, to: number, idx: number) {
        updateLoading(idx, true);
        console.log("from      " + from);
        console.log("to     " + to);
        const result = await fetch(`/api/fetchGmailPaymentNotification?from=${from}&to=${to}&amount=${priceSum}&payerName=${""}`)
            .then(async response => {
                const jsonData: PaymentVerification = await toJSON(response.body);
                console.log(jsonData);
                updatePaymentResult(jsonData);

                async function toJSON(body: any) {
                    const reader = body.getReader();
                    const decoder = new TextDecoder();
                    const chunks: string[] = [];

                    async function read() {
                        const { done, value } = await reader.read();

                        if (done) {
                            return JSON.parse(chunks.join(''));
                        }

                        const chunk = decoder.decode(value, { stream: true });
                        chunks.push(chunk);
                        return read();
                    }

                    return read();
                }
            })
            .catch(error => console.log('API req error:', error))
            .finally(() => {
                updateLoading(idx, false);
            });
    }

    type ResultItem = {
        status: ResultStatusType;
        title: string;
        subTitle: string;
        extra?: React.ReactNode;
    }

    const reservationResultMap: Record<string, ResultItem> = {
        success: {
            status: "success",
            title: "成功預訂房間！",
            subTitle: "到時見!",
            extra: <OrderOverview />,
        },
        failed: {
            status: "warning",
            title: "款項待確認中",
            subTitle: "按以下按鈕以再次確認付款記錄",
            extra:
                <>
                    <Button onClick={() => confirmPayment(fetchPaymentRecordFrom, new Date().getTime(), 2)} loading={loadings[2]}>再次確認已付款</Button>
                    <Divider />
                    <CardPaymentQR />
                </>
            ,
        },
        error: {
            status: "info",
            title: "款項待確認中",
            subTitle: "請稍候 專員現正核實款項 如閣下有任何疑問,亦歡迎向Twitter專頁PM查詢",
            extra: <Button href="https://www.google.com" target="_blank" ><TwitterOutlined />MembersOnly</Button>,
        },
    };

    const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    // const onChangePaymentMethod = (e: RadioChangeEvent) => {
    //     setPaymentMethodSelected(prev => e.target.value);
    // };

    const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        if (name === undefined || name.trim() === '')
            return;
        e.preventDefault();
        setItems([...items, name || `New item ${index++}`]);
        setName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day').subtract(1, 'day');
    };

    const disabledRangeTime: RangePickerProps['disabledTime'] = (current, type) => {
        const key = current?.tz(timeZoneHongKong).startOf('date').unix() as number;
        const disabledHours = mapYYYYMMDD2DisbledHours.get(key) || [];
        return {
            disabledHours: () => disabledHours,
            disabledMinutes: () => [],
            disabledSeconds: () => [],
        }
    };

    function updateDescription(key: string): string {
        if (formRef.current?.getFieldValue(domFee) != undefined &&
            formRef.current?.getFieldValue(bookingDateTime) != undefined &&
            formRef.current?.getFieldValue(bookingDateTime).length == 2) {
            if (key == domFee) {

                // const domFeePerHour = formRef.current?.getFieldValue(domFee);
                // const hour = Math.ceil(dayjs(formRef.current?.getFieldValue(bookingDateTime)[1]).diff(formRef.current?.getFieldValue(bookingDateTime)[0], 'minute', true) / 10) * 10 / 60;
                // return `主人收費${domFeePerHour}/小時 * ${hour}小時`;
            }
            else if (key == hourlyRate) {
                let res = "";
                const headCountVal = formRef.current?.getFieldValue(headCount);
                const hour = Math.ceil(dayjs(formRef.current?.getFieldValue(bookingDateTime)[1]).diff(formRef.current?.getFieldValue(bookingDateTime)[0], 'minute', true) / 10) * 10 / 60;
                if (headCountVal == 1 || headCountVal == 2) {
                    if (hour != 2) {
                        res = "(優惠價)";
                    }
                }
                return res;
            }
        }
        return "";
    }

    function calculatePrice(key: string): number {
        if (key == domFee) {
            if (formRef.current?.getFieldValue(domFee) != undefined &&
                formRef.current?.getFieldValue(bookingDateTime) != undefined && formRef.current?.getFieldValue(bookingDateTime).length == 2 &&
                formRef.current?.getFieldValue(extraService).includes(domService)) {
                const start: Date = dayjs(formRef.current?.getFieldValue(bookingDateTime)[0].startOf('minute')).toDate();
                const end: Date = dayjs(formRef.current?.getFieldValue(bookingDateTime)[1].startOf('minute')).toDate();
                const durationHour: number = Math.abs(end.getTime() - start.getTime()) / 3600000;
                return Math.ceil(formRef.current?.getFieldValue(domFee) *
                    durationHour
                    // Math.ceil(dayjs(formRef.current?.getFieldValue(bookingDateTime)[1]).diff(formRef.current?.getFieldValue(bookingDateTime)[0], 'minute', true) / 10) * 10 / 60
                );
            }
            return 0;
        }
        else if (key == specialEquipment) {
            if (formRef.current?.getFieldValue(extraService).includes(specialEquipment)) {
                return 300;
            }
            return 0;
        }
        else if (key == hourlyRate) {
            if (formRef.current?.getFieldValue(headCount) != undefined &&
                formRef.current?.getFieldValue(bookingDateTime) != undefined && formRef.current?.getFieldValue(bookingDateTime).length == 2) {
                let hourlyRateVal = 0;
                const headCountVal = formRef.current?.getFieldValue(headCount);
                const start: Date = dayjs(formRef.current?.getFieldValue(bookingDateTime)[0].startOf('minute')).toDate();
                const end: Date = dayjs(formRef.current?.getFieldValue(bookingDateTime)[1].startOf('minute')).toDate();
                const durationHour: number = Math.abs(end.getTime() - start.getTime()) / 3600000;
                if (!Number.isInteger(durationHour)) {
                    return 0;
                }
                if (headCountVal == 1 || headCountVal == 2) {
                    if (durationHour == 2) {
                        hourlyRateVal = 400;
                    }
                    else {
                        hourlyRateVal = durationHour * 200 - 100;
                    }
                }
                else {
                    hourlyRateVal = durationHour * headCountVal * 100;
                }
                return hourlyRateVal;
            }
            return 0;
        }
        return -1;
    }

    return (
        <>
            {contextHolder}
            <RcResizeObserver
                key="resize-observer"
                onResize={(offset) => {
                    setResponsive(offset.width < 596);
                }}
            >
                <ProCard
                    style={{
                        background: 'none',
                    }}
                >
                    <StepsForm<{
                        name: string;
                    }>
                        containerStyle={overrideAntProStepsFormContainer}
                        // style={{margin: "10px"}}
                        formRef={formRef}
                        onFinish={async (values) => {
                            // console.log(values);
                            // await waitTime(1000);
                            // message.success('提交成功');
                            // return true;
                        }}
                        formProps={{
                            validateMessages: {
                                required: 'Required',
                            },
                        }}
                        submitter={{
                            render: (props) => {
                                if (props.step === 0) {
                                    return (
                                        <Space>
                                            <Divider />
                                            <Button
                                                type="primary"
                                                loading={loadings[0]}
                                                onClick={() => props.onSubmit?.()}>
                                                前往付款
                                            </Button>
                                        </Space>
                                    );
                                }

                                if (props.step === 1) {

                                    return [
                                        <Space key="pre" >

                                            <Divider />
                                            <Button
                                                onClick={() => props.onPre?.()}
                                                disabled={disableds[1]}
                                            >
                                                返回第一步
                                            </Button>
                                        </Space>,

                                        <Space key="goToTree" >
                                            <Divider />
                                            <Button
                                                type="primary"
                                                loading={loadings[1]}
                                                onClick={() => props.onSubmit?.()}
                                            >
                                                確認已付款
                                            </Button>
                                        </Space>
                                        ,
                                    ];
                                }
                                return [];
                            },
                        }}
                    >
                        <StepsForm.StepForm<{
                            name: string;
                        }>
                            initialValues={{
                                headCount: 2,
                                // bookingDateTime: [dayjs().startOf('hour').add(1, 'hour'), dayjs().startOf('hour').add(3, 'hour')],
                                contactMethod: [{ channel: 'Twitter', contactId: '@test' }],
                            }}
                            onValuesChange={(changeValues) => {
                                console.log(changeValues);
                                console.log(formFields);


                                if (Object.keys(changeValues).includes(headCount) || Object.keys(changeValues).includes(bookingDateTime)) {
                                    // const headCountVal = formRef.current?.getFieldValue(headCount);
                                    // const hour = Math.ceil(dayjs(formRef.current?.getFieldValue(bookingDateTime)[1]).diff(formRef.current?.getFieldValue(bookingDateTime)[0], 'minute', true) / 10) * 10 / 60;
                                    setPriceData(priceData.map(data =>
                                        data.key == hourlyRate || data.key == domFee ? { ...data, description: updateDescription(data.key), price: calculatePrice(data.key) } : data
                                    ));
                                }
                                else if (Object.keys(changeValues).includes(extraService)) {
                                    setPriceData(priceData.map(data =>
                                        data.key == domFee || data.key == specialEquipment ? { ...data, price: calculatePrice(data.key) } : data
                                    ));

                                }
                                else if (Object.keys(changeValues).includes(domFee)) {
                                    setPriceData(priceData.map(data =>
                                        data.key == domFee ? { ...data, price: calculatePrice(data.key) } : data
                                    ));
                                }

                            }}
                            name="step1"
                            title="Information"
                            onFinish={async ({ name }) => {
                                updateLoading(0, true);
                                const a = formRef.current?.getFieldsValue(true);
                                console.log(a);
                                updateLoading(0, false);
                                console.log(formFields);
                                setFormFields((prevFormFields) => {
                                    return {
                                        ...prevFormFields,
                                        ...formRef.current?.getFieldsValue(true),
                                    };
                                });
                                return true;
                            }}
                        >
                            <ProCard split={responsive ? 'horizontal' : 'vertical'}
                            >
                                <ProCard>
                                    <ProFormDateTimeRangePicker
                                        name={bookingDateTime}
                                        label="日期時間"
                                        tooltip="點擊「確定」以確定預約時間，先選擇心水日子，再點擊小時及分鐘　如無法點擊，代表該時段已被預訂"
                                        rules={[
                                            { required: true },
                                            {
                                                validator: async (_, val) => {
                                                    // console.log(val);
                                                    if (val == undefined || val.length === 0)
                                                        return;
                                                    const start = val[0] as Dayjs;
                                                    const end = val[1] as Dayjs;
                                                    const duration = Math.ceil(end.diff(start, 'minute') / 10) * 10;
                                                    if (!(start.get("minute") == 0 || start.get("minute") == 30) ||
                                                        !(end.get("minute") == 0 || end.get("minute") == 30)) {
                                                        return Promise.reject(new Error('預約時間僅接受整點/半小時開始/結束.'));
                                                    }
                                                    if (duration < 120) {
                                                        return Promise.reject(new Error('Minimum of 2 hours required.'));
                                                    }
                                                    // console.log(duration % 60);
                                                    if (duration % 60 !== 0) {
                                                        return Promise.reject(new Error('訂房時長以小時作單位'));
                                                    }
                                                },
                                            },
                                        ]}
                                        fieldProps={
                                            {
                                                // style: {}
                                                // showTime: {{format: ""}}
                                                showTime: {
                                                    format: 'HH:mm',
                                                    minuteStep: 30,
                                                },
                                                format: "YYYY-MM-DD HH:mm",
                                                showNow: true,
                                                // onChange: onChangeRangePicker,
                                                // defaultValue: [startTime, endTime]
                                                allowEmpty: [false, false],
                                                disabledDate: disabledDate,
                                                disabledTime: disabledRangeTime,
                                                placeholder: ['開始時間', '結束時間'],
                                                locale: localeDatePicker,
                                            }
                                        }
                                    />

                                    <ProFormDigit
                                        name={headCount}
                                        label="人數"
                                        tooltip={"基本收費包2人使用(每多1人+100$/小時)"}
                                        rules={[{ required: true }]}
                                        width={'sm'}
                                        fieldProps={
                                            {
                                                precision: 0,
                                                placeholder: "請輸入",
                                            }
                                        }
                                        min={1}
                                        shouldUpdate
                                    >
                                    </ProFormDigit>

                                    <ProForm.Item
                                        name={extraService}
                                        label="附加服務"
                                        rules={[
                                            {
                                                validator: async (_, val) => {
                                                    if (formRef.current?.getFieldValue(headCount) == 1 && (val == undefined || !val.includes(domService))) {
                                                        return Promise.reject(new Error('單人借用者必須加購主人調教項目'));
                                                    }
                                                },
                                            },
                                        ]}
                                    >
                                        <Checkbox.Group>
                                            {optionsExtraService.map((service) => (
                                                <div style={{ display: 'block' }} key={service.label}>
                                                    <Checkbox value={service.value}>
                                                        {service.label}
                                                    </Checkbox>
                                                    <Tooltip title={service.tooltipTitle}>
                                                        <QuestionCircleOutlined />
                                                    </Tooltip>
                                                </div>
                                            ))}
                                        </Checkbox.Group>
                                    </ProForm.Item>

                                    <ProForm.Item
                                        shouldUpdate={(prevValues, currentValues) => prevValues.extraService !== currentValues.extraService}
                                    // style={
                                    //     (formRef.current?.getFieldValue(extraService))?.includes(domService) ? {} : { display: 'none' }
                                    // }
                                    >
                                        {({ getFieldValue }: any) =>
                                            (getFieldValue(extraService))?.includes(domService) ? (
                                                <ProFormDigit
                                                    name={domFee}
                                                    label="主人調教收取費用"
                                                    rules={[{ required: true }]}
                                                    width='sm'
                                                    addonBefore="$"
                                                    addonAfter="每小時"
                                                    fieldProps={
                                                        {
                                                            min: 300,
                                                            placeholder: "請輸入",
                                                            precision: 0,
                                                            step: 50,
                                                        }
                                                    }
                                                />
                                            ) : null
                                        }
                                    </ProForm.Item>
                                    <ProForm.Item
                                        name="contact"
                                        label="聯絡方式"
                                        tooltip="Twitter: @userid"
                                    >
                                        <Form.List
                                            name="contactMethod"
                                            rules={[
                                                {
                                                    validator: async (_, val) => {
                                                        if (!val || val.length < 1) {
                                                            // return Promise.reject(new Error('At least 1 contact method'));
                                                        }
                                                    },
                                                },
                                            ]}
                                        >
                                            {(fields, { add, remove }, { errors }) => (
                                                <>
                                                    <Form.Item>
                                                        <Button
                                                            type="dashed"
                                                            onClick={() => add()}
                                                            icon={<PlusOutlined />}
                                                        >
                                                            Add Contact Method
                                                        </Button>
                                                        <Form.ErrorList errors={errors} />
                                                    </Form.Item>
                                                    {fields.map((field, index) => (
                                                        <Form.Item
                                                            required={false}
                                                            key={field.key}
                                                        >
                                                            <Form.Item
                                                                validateTrigger={['onChange', 'onBlur']}
                                                                rules={[
                                                                    {
                                                                        validator: async (_, val) => {
                                                                            if (!val || val.trim() === '') {
                                                                                return Promise.reject(new Error('Channel required!'));
                                                                            }
                                                                        },
                                                                        // required: true,
                                                                        // message: `Please Input Contact Method. ${JSON.stringify(field)}`,
                                                                    },
                                                                ]}
                                                                noStyle
                                                                name={[index, "channel"]}
                                                            >

                                                                <Select
                                                                    style={{ display: 'inline-block', width: '30%', margin: '0 1% 0 0' }}
                                                                    placeholder="Channel"
                                                                    dropdownRender={(menu) => (
                                                                        <>
                                                                            {menu}
                                                                            <Divider style={{ margin: '8px 0' }} />
                                                                            <Space >
                                                                                <Input
                                                                                    placeholder=""
                                                                                    ref={inputRef}
                                                                                    value={name}
                                                                                    onChange={onChangeName}
                                                                                />
                                                                                <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                                                                                </Button>
                                                                            </Space>
                                                                        </>
                                                                    )}
                                                                    options={items.map((item) => ({ label: item, value: item }))}
                                                                />
                                                            </Form.Item>

                                                            <Form.Item
                                                                validateTrigger={['onChange', 'onBlur']}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: "Contact ID required!",
                                                                    },
                                                                ]}
                                                                noStyle
                                                                name={[index, "contactId"]}
                                                            >
                                                                <Input placeholder="ID" style={{ display: 'inline-block', width: '50%' }} />

                                                            </Form.Item>
                                                            {fields.length > 1 ? (
                                                                <MinusCircleOutlined
                                                                    className="dynamic-delete-button"
                                                                    onClick={() => remove(field.name)}
                                                                    style={{ display: 'inline-block', width: '10%' }}
                                                                />
                                                            ) : null}
                                                        </Form.Item>
                                                    ))}

                                                </>
                                            )}
                                        </Form.List>
                                    </ProForm.Item>
                                </ProCard>
                                <ProCard>
                                    <ProDescriptions
                                        column={1}
                                        title="訂單概要"
                                        tooltip="m"
                                    >
                                        <ProDescriptions.Item
                                            label="細項"
                                        >
                                            <ListPaymentLumpSum />
                                        </ProDescriptions.Item>
                                    </ProDescriptions>
                                </ProCard>
                            </ProCard>

                        </StepsForm.StepForm>
                        <StepsForm.StepForm<{
                            name: string;
                        }>
                            initialValues={{
                                paymentType: payme,
                            }}
                            name="step2"
                            title="Payment"
                            onFinish={async ({ name }) => {
                                const fetchPaymentRecordTo = Date.now();
                                await confirmPayment(fetchPaymentRecordFrom, fetchPaymentRecordTo, 1);
                                // const result: PaymentVerification = await verifyPayment(fetchPaymentRecordFrom, fetchPaymentRecordTo, priceSum);
                                // console.log(name);
                                // await waitTime(2000);
                                const a = formRef.current?.getFieldsValue(true);
                                console.log(a);
                                return true;
                            }}
                        >
                            <ProCard split={responsive ? 'horizontal' : 'vertical'}>
                                <ProCard>
                                    <Title level={3}>
                                        你可以Payme付款
                                    </Title>
                                    {/* {paymentMethodSelected == payme ? */}
                                    <CardPaymentQR />
                                    {/* :
                                    <Card>
                                        <Title level={4}>
                                            轉數快(FPS)
                                        </Title>
                                        <Image
                                            width={200}
                                            height={200}
                                            src="/assets/qrcode_fps.png"
                                            alt="fps-qr-code"
                                        />
                                    </Card> */}
                                    {/* } */}

                                    {/* <ProFormRadio.Group

                                    name="paymentType"
                                    label="付款方式"
                                    options={[
                                        {
                                            label: "Payme",
                                            value: "payme",
                                        },
                                        {
                                            label: "FPS",
                                            value: "FPS",
                                        },
                                    ]}
                                    radioType={"button"}
                                    fieldProps={
                                        {
                                            onChange: onChangePaymentMethod
                                            // value: paymentMethodSelected
                                            // defaultValue: "payme",
                                        }
                                    }
                                />
                                <ProForm.Item shouldUpdate={(prevValues, currentValues) => prevValues.paymentType !== currentValues.paymentType}>
                                    {({ getFieldValue }: any) =>
                                        getFieldValue('paymentType') === 'FPS' ? (
                                            <ProFormText
                                                name="fpsId"
                                                label="FPS Identifier"
                                                rules={[{ required: true }]}
                                                width='sm'
                                            />
                                        ) : null
                                    }
                                </ProForm.Item> */}
                                </ProCard>
                                <ProCard>
                                    <ProForm.Item
                                        noStyle
                                        shouldUpdate>
                                        {(form) => {
                                            return (
                                                <OrderOverview />
                                            )
                                        }}
                                    </ProForm.Item>
                                </ProCard>
                            </ProCard>
                        </StepsForm.StepForm>
                        <StepsForm.StepForm name="orderConfirmation" title="Order Confirmation"
                            onFinish={async ({ name }) => {
                                return true;
                            }}
                        >
                            <Result
                                status={reservationResultMap[paymentResult].status}
                                title={reservationResultMap[paymentResult].title}
                                subTitle={reservationResultMap[paymentResult].subTitle}
                                extra={reservationResultMap[paymentResult].extra}
                            />
                        </StepsForm.StepForm>
                    </StepsForm >
                </ProCard>
            </RcResizeObserver >
        </>
    );
};

export default MultiStepForm;