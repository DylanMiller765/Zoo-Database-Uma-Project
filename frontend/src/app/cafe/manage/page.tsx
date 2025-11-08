import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DeprecatedCafeManagePage() {
  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Page Moved</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">
            Café item management now lives under <span className="font-medium">Admin → Cafés</span>. Please use
            the Admin Cafés page to add or delete menu items.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
