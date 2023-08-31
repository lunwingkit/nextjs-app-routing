'use client';
import { Button } from "antd";
import Link from "next/link";
import { Carousel, Typography, Card } from 'antd';

const { Title, Paragraph, Text, } = Typography;

const contentStyle: React.CSSProperties = {
    height: '300px',
    color: '#fff',
    lineHeight: '500px',
    textAlign: 'center',
    background: '#364d79',
};

export default function About() {
    return (
        <>
            <Carousel effect="fade">
                <div>
                    <h3 style={contentStyle}>1</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>2</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>3</h3>
                </div>
                <div>
                    <h3 style={contentStyle}>4</h3>
                </div>
            </Carousel>
            <Card>

                <Button type="primary">
                    <Link href="/">
                        About us!
                    </Link>
                </Button>
                <Button type="primary">
                    <Link href="/checkout">
                        Make a booking!
                    </Link>
                </Button>
            </Card>
            <Card>

                <Typography title="About">
                    <Title>About</Title>
                    <Paragraph>
                        PPP
                    </Paragraph>
                    <Title>Target Customer</Title>
                    <Paragraph>
                        PPP
                    </Paragraph>
                </Typography>
            </Card>
        </>
    )
}