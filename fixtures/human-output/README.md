# Catalog fixture

The catalog coordinates lookup. It rejects an empty key, checks a local cache,
and delegates misses to a remote reader. Only successful lookups are cached.
The cache retains one entry, so this is not a complete catalog replica.
The remote reader loads a configurable adapter. Static module relationships alone
cannot establish which adapter will load, its availability, or network behavior.
