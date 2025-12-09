import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { NewSessionButton } from "@/components/NewSessionButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-[family-name:var(--font-geist-sans)]">
      <header className="px-6 py-4 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          <span>Mastermind</span>
        </div>
        {session && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {session.user?.name}
            </span>
            <Link
              href="/api/auth/signout"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Sign out
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {!session ? (
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                AI Document Agents
              </h1>
              <p className="text-slate-500">
                Sign in to collaborate with expert AI agents on your Google Docs.
              </p>
            </div>
            <Link
              href="/api/auth/signin"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
            >
              Sign in with Google
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="max-w-4xl w-full space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-slate-900">
                Welcome back, {session.user?.name?.split(" ")[0]}!
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Ready to review your documents? Select an agent team and start a session.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-left">
              <NewSessionButton />

              <div className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-purple-300 transition-all cursor-pointer opacity-75">
                <div className="absolute top-6 right-6 p-2 bg-purple-50 rounded-lg">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Existing Document
                </h3>
                <p className="text-slate-500 mb-4">
                  Import a document from your Drive (Coming soon).
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
