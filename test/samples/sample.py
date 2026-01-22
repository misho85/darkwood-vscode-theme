# Python Sample
from typing import Optional, List, Dict
from dataclasses import dataclass
from enum import Enum
import asyncio

API_KEY = "secret_key_123"
MAX_CONNECTIONS = 100


class Status(Enum):
    """Status enumeration for tasks."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class Task:
    """Represents a single task."""
    id: int
    name: str
    status: Status = Status.PENDING
    metadata: Optional[Dict] = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


class TaskManager:
    """Manages task execution and lifecycle."""

    def __init__(self, max_workers: int = 4):
        self._tasks: List[Task] = []
        self._max_workers = max_workers
        self._running = False

    async def add_task(self, name: str) -> Task:
        """Add a new task to the queue."""
        task = Task(
            id=len(self._tasks) + 1,
            name=name,
        )
        self._tasks.append(task)
        return task

    async def process_all(self) -> List[Task]:
        """Process all pending tasks."""
        self._running = True
        try:
            for task in self._tasks:
                if task.status == Status.PENDING:
                    task.status = Status.RUNNING
                    await self._execute(task)
                    task.status = Status.COMPLETED
        except Exception as e:
            task.status = Status.FAILED
            raise RuntimeError(f"Task failed: {e}") from e
        finally:
            self._running = False
        return self._tasks

    async def _execute(self, task: Task) -> None:
        """Execute a single task."""
        await asyncio.sleep(0.1)  # Simulate work
        task.metadata["executed_at"] = asyncio.get_event_loop().time()


# Lambda and comprehension examples
square = lambda x: x ** 2
squares = [x ** 2 for x in range(10) if x % 2 == 0]
mapping = {k: v for k, v in enumerate(squares)}


async def main():
    manager = TaskManager(max_workers=2)
    await manager.add_task("First task")
    await manager.add_task("Second task")
    results = await manager.process_all()
    print(f"Completed {len(results)} tasks")


if __name__ == "__main__":
    asyncio.run(main())
