const form = document.querySelector("#task-form");
const todoColumn = document.querySelector("#todo");

const priorityClass = {
  Alta: "high",
  Media: "medium",
  Baja: "low",
};

const priorityLabel = {
  Alta: "Alta",
  Media: "Media",
  Baja: "Baja",
};

function createCard({ plate, type, priority, notes }) {
  const card = document.createElement("article");
  card.className = "card";

  const title = document.createElement("div");
  title.className = "card-title";
  title.textContent = `${type} - ${plate}`;

  const meta = document.createElement("p");
  meta.className = "card-meta";
  meta.textContent = notes ? notes : "Solicitud ingresada recientemente";

  const tags = document.createElement("div");
  tags.className = "card-tags";

  const priorityTag = document.createElement("span");
  priorityTag.className = `tag ${priorityClass[priority]}`;
  priorityTag.textContent = priorityLabel[priority];

  const typeTag = document.createElement("span");
  typeTag.className = "tag";
  typeTag.textContent = type;

  tags.append(priorityTag, typeTag);

  card.append(title, meta, tags);

  return card;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const task = {
    plate: data.get("plate").toString().trim().toUpperCase(),
    type: data.get("type").toString(),
    priority: data.get("priority").toString(),
    notes: data.get("notes").toString().trim(),
  };

  if (!task.plate) {
    return;
  }

  const card = createCard(task);
  todoColumn.prepend(card);
  form.reset();
});
