import Image from "next/image";

type HomeIconProps = {
  name: string;
  size?: number;
  className?: string;
};

export function HomeIcon({ name, size = 56, className }: HomeIconProps) {
  return (
    <Image
      src={`/icons/home/${name}.svg`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
    />
  );
}
