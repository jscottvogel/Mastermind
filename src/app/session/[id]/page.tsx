import { SessionView } from "@/components/SessionView";

type Params = Promise<{ id: string }>;

export default async function SessionPage(props: { params: Params }) {
    const params = await props.params;
    const { id } = params;

    return <SessionView docId={id} />;
}
