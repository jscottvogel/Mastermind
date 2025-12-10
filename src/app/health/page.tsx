export const dynamic = 'force-dynamic';

export default function HealthPage() {
    return (
        <div className="p-8 font-mono">
            <h1 className="text-2xl font-bold mb-4">Health Check</h1>
            <p>Status: <span className="text-green-600">OK</span></p>
            <p>Timestamp: {new Date().toISOString()}</p>
            <div className="mt-4 p-4 bg-slate-100 rounded">
                <p>Runtime Environment Check:</p>
                <ul className="list-disc pl-4 mt-2">
                    <li>NODE_ENV: {process.env.NODE_ENV}</li>
                    <li>NEXTAUTH_URL: {process.env.NEXTAUTH_URL ? 'Set' : 'MISSING'}</li>
                    <li>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? 'Set' : 'MISSING'}</li>
                    <li>GOOGLE_CLIENT_ID: {process.env.GOOGLE_CLIENT_ID ? 'Set' : 'MISSING'}</li>
                </ul>
                <div className="mt-4">
                    <p className="font-bold">Available Keys:</p>
                    <pre className="text-xs overflow-auto max-h-40">{JSON.stringify(Object.keys(process.env).sort(), null, 2)}</pre>
                </div>
            </div>
        </div>
    );
}
