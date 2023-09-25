// Retirado do conteúdo da Trybe

export type NewEntity<T> = Omit<T, 'id'>;

export type ID = number;

export type Identifiable = { id: ID };
