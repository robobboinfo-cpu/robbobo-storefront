import { descriptionParts } from '../lib/productDescription'

export default function ProductDescription({ value }) {
  return <div style={{ overflowWrap: 'anywhere' }}>{descriptionParts(value).map((part, index) => part.type === 'image'
    ? <img key={index} src={part.url} alt={part.alt} loading="lazy" style={{ display: 'block', maxWidth: '100%', height: 'auto', margin: '20px auto', borderRadius: 12 }} />
    : <div key={index} style={{ whiteSpace: 'pre-wrap', minHeight: part.text ? undefined : '1em' }}>{part.text}</div>)}</div>
}
