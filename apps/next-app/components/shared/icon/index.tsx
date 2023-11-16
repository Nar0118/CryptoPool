import Image from 'components/shared/image';
import { ImageProps } from 'next/image';

export default function Icon({ src, ...rest }: ImageProps): JSX.Element {
  return <Image src={`/icons/${src}`} {...rest} />;
}
