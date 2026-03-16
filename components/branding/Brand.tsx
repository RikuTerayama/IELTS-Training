import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/ui/theme';

type BrandMarkProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  showText?: boolean;
  size?: number;
  textClassName?: string;
};

type BrandLinkProps = BrandMarkProps & {
  href: string;
  linkClassName?: string;
};

export function BrandMark({
  className,
  imageClassName,
  priority = false,
  showText = true,
  size = 36,
  textClassName,
}: BrandMarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <Image
        src="/branding/meridian.png"
        alt="Meridian"
        width={size}
        height={size}
        priority={priority}
        className={cn(
          'rounded-full bg-white object-contain shadow-sm ring-1 ring-border/70',
          imageClassName
        )}
      />
      {showText ? (
        <span className={cn('font-bold tracking-tight text-text', textClassName)}>Meridian</span>
      ) : null}
    </span>
  );
}

export function BrandLink({
  href,
  linkClassName,
  ...props
}: BrandLinkProps) {
  return (
    <Link href={href} className={cn('inline-flex items-center', linkClassName)}>
      <BrandMark {...props} />
    </Link>
  );
}
