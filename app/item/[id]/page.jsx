import { marketplaceItems } from '../../data';
import ItemClient from './item-client';

export function generateStaticParams() {
  return [...marketplaceItems.map((item) => ({ id: item.id })), { id: 'bored-ape' }];
}

export default function ItemPage({ params }) {
  return <ItemClient id={params.id} />;
}
