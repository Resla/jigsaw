/** Simple disjoint-set structure used to track which pieces have connected into a single group. */
export class UnionFind {
  private parent = new Map<number, number>();
  private members = new Map<number, Set<number>>();

  makeSet(id: number): void {
    if (!this.parent.has(id)) {
      this.parent.set(id, id);
      this.members.set(id, new Set([id]));
    }
  }

  find(id: number): number {
    const parent = this.parent.get(id);
    if (parent === undefined) {
      this.makeSet(id);
      return id;
    }
    if (parent === id) return id;
    const root = this.find(parent);
    this.parent.set(id, root);
    return root;
  }

  connected(a: number, b: number): boolean {
    return this.find(a) === this.find(b);
  }

  /** Merges the groups containing a and b. Returns false if they were already the same group. */
  union(a: number, b: number): boolean {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA === rootB) return false;

    const membersA = this.members.get(rootA)!;
    const membersB = this.members.get(rootB)!;
    const [bigRoot, bigSet, smallRoot, smallSet] =
      membersA.size >= membersB.size
        ? [rootA, membersA, rootB, membersB]
        : [rootB, membersB, rootA, membersA];

    for (const id of smallSet) {
      bigSet.add(id);
      this.parent.set(id, bigRoot);
    }
    this.members.delete(smallRoot);
    return true;
  }

  groupMembers(id: number): number[] {
    const root = this.find(id);
    return Array.from(this.members.get(root) ?? [id]);
  }

  groupSize(id: number): number {
    return this.members.get(this.find(id))?.size ?? 1;
  }

  /** Serializes to a plain id -> groupRootId map, for persistence. */
  toGroupMap(): Record<number, number> {
    const out: Record<number, number> = {};
    for (const id of this.parent.keys()) {
      out[id] = this.find(id);
    }
    return out;
  }

  static fromGroupMap(groupMap: Record<number, number>): UnionFind {
    const uf = new UnionFind();
    const byGroup = new Map<number, number[]>();
    for (const [idStr, root] of Object.entries(groupMap)) {
      const id = Number(idStr);
      uf.makeSet(id);
      if (!byGroup.has(root)) byGroup.set(root, []);
      byGroup.get(root)!.push(id);
    }
    for (const ids of byGroup.values()) {
      for (let i = 1; i < ids.length; i++) uf.union(ids[0], ids[i]);
    }
    return uf;
  }
}
