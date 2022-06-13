export type SearchKey = 
{
  query: string;
  type: 'keyword';
} | {
  tagId: string;
  query: string;
  type: 'tag';
}