import { Resource, ResourceCategory } from '@/types';
import { initialResources } from '@/lib/mockData';

let localResourcesStore: Resource[] = [...initialResources];

export async function getResources(category?: ResourceCategory | 'ALL'): Promise<Resource[]> {
  if (category && category !== 'ALL') {
    return localResourcesStore.filter((r) => r.category === category);
  }
  return Promise.resolve([...localResourcesStore]);
}

export async function createResource(resource: Omit<Resource, 'id' | 'addedAt'>): Promise<Resource> {
  const newRes: Resource = {
    ...resource,
    id: `res-${Date.now()}`,
    addedAt: new Date().toISOString().split('T')[0],
  };
  localResourcesStore.push(newRes);
  return newRes;
}

export async function deleteResource(id: string): Promise<boolean> {
  const lenBefore = localResourcesStore.length;
  localResourcesStore = localResourcesStore.filter((r) => r.id !== id);
  return localResourcesStore.length < lenBefore;
}
