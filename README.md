<h1 align="center">Strapi Document Designer</h1>
<p align="center">Create your own templates for document and create them by your scenario</p>

<br/>
<br/>
<br/>
<p align="center"><strong>WORK IN PROGRESS</strong></p>
<br/>
<br/>
<br/>

## ⚡ **Enhanced Idea**

1. **Generate Content** → Gather necessary data from a scenario.
2. **Template** → Combine the template string (HTML) with the data to produce dynamic content.
3. **HTML Generation** → Merge the template and scenario data into a complete HTML structure.
4. **PDF Generation** → Convert the HTML into a PDF file, save it to the `public` folder, and record it in the database.

---

## ⭐ **Roadmap**

##### **Step 1: Template Management**

- [x] **Create a Collection Type** for templates:
  - Fields: Template name, description, and the RichText.

##### **Step 2: Scenario Management**

- [x] **Define the Scenario Logic**:
  - Title and description fields for clarity.
  - A `TemplateID` field to link each scenario to a specific template.
  - An array of fields for dynamic content:
    - Relation with other Content Types (optional).
    - Field name, title, and a flag indicating if it's required.
  - Add a `getContent` method:
    - This function fetches and organizes the scenario-specific data required for template generation.

##### **Step 3: Content Types**

- [x] **Create a Scenario Content Type**:

  - Organize scenarios as reusable and customizable entities.

- [x] **Create a History Content Type**:

  - Store and manage document generating history.

##### **Step 4: Generator Services**

- [x] **Set Up a Folders**:

  - Create folder generator in the `extensions` folder to house logic and tools for generating documents.
  - Create folder generator in the `public` folder to house documents.
  - Add this to the application registry.

- [x] **Implement a Service** to:
  - Save scenarios to plugin.

##### **Step 5: HTML Generation**

- [x] **Develop a Service**:
  - Fetch content from `getContent` in the scenario logic.
  - Generate a complete HTML string based on templates and scenario data.

##### **Step 6: Document History**

- [x] **Create a Collection Type** for document history:
  - Fields: Title, description, document URL, TemplateID, fileName, creation date, and last updated date.

##### **Step 7: Plugin Configuration**

- [x] Add customizable parts to the configuration:
  - Define template sections like `Head`, `Header`, and `Footer`.

##### **Step 8: PDF Generation**

- [ ] **Generate PDFs**:
  - Use the generated HTML to produce a PDF.
  - Save the PDF to the `public` folder and log it in the database.

##### **Step 9: Document Management**

- [ ] **Develop a Service**:
  - CRUD operations for documents in the database and `public` folder.

##### **Step 10: History Management**

- [ ] **Create Controllers and Routes**:
  - Allow access to and management of generated document history.

##### **Step 11: UI for Document History**

- [ ] **Build a UI**:
  - Enable users to view and manage the history of generated documents.

##### **Step 12: Backend API for Scenario Management**

- [ ] **Build Controllers and Routes** to:
  - Viewing scenarios.
  - Generate documents based on scenarios.

##### **Step 13: UI for Scenario Management**

- [ ] **Design User Interfaces**:
  - Manage scenario creation.
  - Allow users to generate documents based on defined scenarios.
