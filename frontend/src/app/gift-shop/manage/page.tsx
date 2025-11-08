import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DeprecatedGiftShopManagePage() {
  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Page Moved</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">
            Gift shop item management now lives under <span className="font-medium">Admin → Gift Shops</span>. Please use
            the Admin Gift Shops page to add or delete items.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
