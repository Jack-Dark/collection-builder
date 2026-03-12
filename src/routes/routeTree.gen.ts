import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/routeTree/gen')({
  component: RouteComponent,
});

function RouteComponent() {
  return null;
  // return <div>Hello "/routeTree/gen"!</div>
}
