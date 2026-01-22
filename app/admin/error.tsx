// Suspended error boundary
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div>
            <h2>Disabled Error Boundary</h2>
            <p>{error.message}</p>
        </div>
    );
}
