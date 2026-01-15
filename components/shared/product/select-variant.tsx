import { Button } from '@/components/ui/button';
import { IProductData } from '@/types';
import Link from 'next/link';

export default function SelectVariant({
  product,
  size,
  color,
}: {
  product: IProductData;
  size: string;
  color: string;
}) {
  const selectedColor = color || product.colors[0];
  const selectedSize = size || product.sizes[0];

  return (
    <>
      {product.colors.length > 0 && (
        <div className="space-x-2 space-y-2 ">
          <div>Color:</div>
          {product.colors.map((x: string) => (
            <Button
              asChild
              variant="outline"
              key={x}
              className={
                selectedColor === x ? 'border-2 border-primary' : 'border-2'
              }
            >
              <Link
                replace
                scroll={false}
                href={`?${new URLSearchParams({
                  color: x,
                  size: selectedSize,
                })}`}
                key={x}
              >
                <div
                  style={{ backgroundColor: x }}
                  className="w-4 h-4 rounded-full border border-muted-foreground"
                ></div>
                {x}
              </Link>
            </Button>
          ))}
        </div>
      )}

      {product.sizes.length > 0 && (
        <div className="space-x-2 space-y-2 ">
          <div>Size:</div>
          {product.sizes.map((x: string) => (
            <Button
              asChild
              variant="outline"
              key={x}
              className={
                selectedSize === x ? 'border-2 border-primary' : 'border-2'
              }
            >
              <Link
                replace
                scroll={false}
                href={`?${new URLSearchParams({
                  color: selectedColor,
                  size: x,
                })}`}
              >
                {x}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </>
  );
}
