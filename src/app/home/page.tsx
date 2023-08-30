import Link from "next/link";

export default function Home() {
    return (
        <>
            <h1>Home</h1>
            <Link href="/about">
                <button>
                    About
                </button>
            </Link>

            <Link href="/home">
                <button>
                    home
                </button>
            </Link>
        </>
    );
}