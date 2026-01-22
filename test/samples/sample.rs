// Rust Sample
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

const MAX_BUFFER_SIZE: usize = 1024;
static GLOBAL_COUNTER: std::sync::atomic::AtomicUsize = std::sync::atomic::AtomicUsize::new(0);

/// Represents a cache entry with metadata
#[derive(Debug, Clone)]
pub struct CacheEntry<T> {
    pub value: T,
    pub created_at: u64,
    pub ttl: Option<u64>,
}

/// A thread-safe cache implementation
pub struct Cache<K, V> {
    store: Arc<RwLock<HashMap<K, CacheEntry<V>>>>,
    max_size: usize,
}

impl<K, V> Cache<K, V>
where
    K: std::hash::Hash + Eq + Clone,
    V: Clone,
{
    pub fn new(max_size: usize) -> Self {
        Self {
            store: Arc::new(RwLock::new(HashMap::new())),
            max_size,
        }
    }

    pub async fn get(&self, key: &K) -> Option<V> {
        let store = self.store.read().await;
        store.get(key).map(|entry| entry.value.clone())
    }

    pub async fn set(&self, key: K, value: V, ttl: Option<u64>) -> Result<(), CacheError> {
        let mut store = self.store.write().await;

        if store.len() >= self.max_size {
            return Err(CacheError::Full);
        }

        let entry = CacheEntry {
            value,
            created_at: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            ttl,
        };

        store.insert(key, entry);
        Ok(())
    }
}

#[derive(Debug, thiserror::Error)]
pub enum CacheError {
    #[error("Cache is full")]
    Full,
    #[error("Key not found")]
    NotFound,
}

// Pattern matching example
fn process_result<T: std::fmt::Debug>(result: Result<T, CacheError>) {
    match result {
        Ok(value) => println!("Success: {:?}", value),
        Err(CacheError::Full) => eprintln!("Error: cache is full"),
        Err(CacheError::NotFound) => eprintln!("Error: key not found"),
    }
}

// Lifetime and generic example
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

#[tokio::main]
async fn main() {
    let cache: Cache<String, i32> = Cache::new(100);

    cache.set("key1".to_string(), 42, Some(3600)).await.unwrap();

    if let Some(value) = cache.get(&"key1".to_string()).await {
        println!("Got value: {}", value);
    }
}
