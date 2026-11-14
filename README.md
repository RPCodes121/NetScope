# NetScope

**NetScope** is a web-based network traffic analysis application for
inspecting packet-capture files and summarising the network activity
they contain. It combines a React dashboard, a Java Spring Boot REST
API, and PostgreSQL.

The current MVP focuses on **offline PCAP/PCAPNG analysis**: upload a
capture, parse its packets, calculate protocol statistics, extract
network flows, and view the stored results through the dashboard.

## Project status

**Current stage: Deployed MVP / active development**

-   [x] React + Vite frontend deployed on Vercel.
-   [x] Spring Boot backend deployed on Render.
-   [x] PostgreSQL database provisioned on Render.
-   [x] Backend connected to the hosted PostgreSQL database.
-   [x] Capture upload and offline packet parsing implemented.
-   [x] Protocol statistics persisted per capture.
-   [x] Network-flow extraction and persistence implemented.
-   [x] REST endpoints for captures and extracted flows.
-   [ ] Further end-to-end validation and refinement of the production
    workflow.
-   [ ] Additional analytics, anomaly detection, and operational
    features are planned, not represented as completed functionality.

> NetScope is an MVP. Features listed as planned below should not be
> interpreted as already implemented.

## What it does

### Capture upload and analysis

-   Accepts `.pcap` and `.pcapng` files through a multipart upload
    endpoint.
-   Validates that an uploaded file is present, non-empty, within the
    configured upload limit, and has a supported extension.
-   Processes captures offline using Pcap4J.
-   Counts packets and total captured bytes.
-   Classifies packets into protocol categories, including TCP, UDP,
    ICMP, ICMPv6, ARP, and OTHER.
-   Extracts network-flow records from IP packets.

### Protocol statistics

For each capture, NetScope stores packet counts grouped by protocol.
These statistics are associated with the capture record and returned
through the capture API.

### Network-flow extraction

For supported IP traffic, NetScope groups packets by a flow key
containing source IP, destination IP, source port (where available),
destination port (where available), and protocol.

Each extracted flow records packet count, total bytes, first-seen
timestamp, and last-seen timestamp.

### Dashboard

The React frontend provides dashboard views for available capture and
flow data. The current UI includes navigation for Overview, Captures,
Network Flows, Anomalies, and Analytics. The Anomalies and Analytics
areas are placeholders / future work unless separately implemented.

## Architecture

``` text
                 Browser
                    |
                    v
          React + Vite frontend
                 Vercel
                    |
             HTTPS REST API
                    |
                    v
        Spring Boot REST backend
                 Render
                    |
                    v
             PostgreSQL
                 Render
```

The frontend communicates with the backend through HTTP requests. The
backend parses uploaded capture files, creates capture/protocol/flow
records, and persists them in PostgreSQL.

## Technology stack

  Area                      Tools / technologies
  ------------------------- ----------------------------
  Frontend                  React, JavaScript, Vite
  Styling                   Tailwind CSS
  Charts                    Recharts
  Icons                     lucide-react
  HTTP client               Axios
  Backend                   Java, Spring Boot
  REST API                  Spring Web MVC
  Persistence               Spring Data JPA, Hibernate
  Database                  PostgreSQL
  Packet parsing            Pcap4J
  API documentation         Springdoc OpenAPI
  Build                     Maven
  Containerization          Docker
  Frontend hosting          Vercel
  Backend hosting           Render
  Database hosting          Render PostgreSQL
  API testing               Postman
  Database administration   pgAdmin
  Version control           Git, GitHub

## Repository structure

``` text
NetScope/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/netscope/backend/
│           │   ├── config/
│           │   ├── controller/
│           │   ├── dto/
│           │   ├── exception/
│           │   ├── model/
│           │   ├── parser/
│           │   ├── repository/
│           │   └── service/
│           └── resources/
│               └── application.yml
├── database/
│   └── init.sql
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── services/
        └── ...
```

The exact set of files may evolve as development continues.

## Database design

The current schema contains three principal tables:

  -----------------------------------------------------------------------
  Table                               Purpose
  ----------------------------------- -----------------------------------
  `captures`                          Stores uploaded capture metadata
                                      and aggregate packet/byte counts.

  `protocol_statistics`               Stores packet counts grouped by
                                      protocol for each capture.

  `network_flows`                     Stores extracted flow endpoints,
                                      protocol, packet/byte counts, and
                                      timestamps.
  -----------------------------------------------------------------------

The schema is defined in `database/init.sql`.

The backend currently uses Hibernate schema validation
(`ddl-auto: validate`) rather than automatically creating or modifying
the production schema. Apply schema changes through controlled SQL
migrations or an updated database initialization/migration process.

## API

The backend API is rooted at `/api`.

  --------------------------------------------------------------------------------------------
  Method                  Endpoint                                     Description
  ----------------------- -------------------------------------------- -----------------------
  `POST`                  `/api/captures`                              Upload and analyse a
                                                                       PCAP/PCAPNG file.
                                                                       Expects multipart form
                                                                       data with the field
                                                                       name `file`.

  `GET`                   `/api/captures`                              List stored captures.

  `GET`                   `/api/captures/{id}`                         Retrieve a capture by
                                                                       ID, including protocol
                                                                       statistics.

  `GET`                   `/api/captures/{captureId}/flows`            List flows extracted
                                                                       from a capture.

  `GET`                   `/api/captures/{captureId}/flows/{flowId}`   Retrieve a specific
                                                                       flow belonging to a
                                                                       capture.
  --------------------------------------------------------------------------------------------

Example upload:

``` bash
curl -X POST "http://localhost:8080/api/captures" \
  -F "file=@sample.pcapng"
```

Example requests:

``` bash
curl "http://localhost:8080/api/captures"
curl "http://localhost:8080/api/captures/1"
curl "http://localhost:8080/api/captures/1/flows"
```

## Running locally

### Prerequisites

-   Java 21 or compatible JDK
-   Maven (or use the included Maven wrapper)
-   Node.js and npm
-   PostgreSQL
-   Docker, if you want to build/run the backend container
-   The native packet-capture library required by Pcap4J on your
    operating system (the Linux deployment image installs `libpcap`)

### 1. Create the database

Create a PostgreSQL database and user for NetScope, then apply the
schema:

``` bash
psql -U netscope -d netscope -f database/init.sql
```

Alternatively, open `database/init.sql` in pgAdmin's Query Tool and
execute it against the `netscope` database.

### 2. Configure and run the backend

For local development, create `backend/.env` if using the project's
dotenv integration:

``` env
DB_PASSWORD=your_local_database_password
```

Configure the local datasource to point to your local PostgreSQL
instance. The application uses port `8080` by default.

From the `backend` directory:

``` powershell
# Windows PowerShell
.\mvnw.cmd spring-boot:run
```

``` bash
# macOS / Linux
./mvnw spring-boot:run
```

The API should be available at `http://localhost:8080/api`.

### 3. Configure and run the frontend

Create `frontend/.env.local`:

``` env
VITE_API_URL=http://localhost:8080/api
```

Then install dependencies and start Vite:

``` bash
cd frontend
npm install
npm run dev
```

The frontend is normally available at `http://localhost:5173`.

### 4. Build the frontend

``` bash
cd frontend
npm run build
```

Vite writes the production build to `frontend/dist`.

## Environment variables

### Backend

Configure these in the backend hosting provider:

  ----------------------------------------------------------------------------------
  Variable                            Purpose
  ----------------------------------- ----------------------------------------------
  `SPRING_DATASOURCE_URL`             PostgreSQL JDBC URL,
                                      e.g. `jdbc:postgresql://HOST:5432/netscope`.

  `SPRING_DATASOURCE_USERNAME`        PostgreSQL username.

  `SPRING_DATASOURCE_PASSWORD`        PostgreSQL password.

  `PORT`                              Port supplied by the hosting platform; the
                                      application falls back to `8080` locally.
  ----------------------------------------------------------------------------------

For local development, the project may use `DB_PASSWORD` through its
dotenv integration.

**Important:** Spring Boot expects a JDBC URL (`jdbc:postgresql://...`),
not the raw `postgresql://` URL shown by some database dashboards. Keep
database credentials on the backend. Never commit `.env` files or
credentials to Git.

### Frontend

  Variable         Purpose
  ---------------- ------------------------------------------------
  `VITE_API_URL`   Base URL of the backend API, including `/api`.

Example production value:

``` env
VITE_API_URL=https://YOUR-BACKEND.onrender.com/api
```

Vite variables prefixed with `VITE_` are included in the browser bundle.
Only put public configuration such as the API base URL in them; never
put secrets there. Redeploy the frontend after changing Vercel
environment variables.

## Deployment

### Frontend --- Vercel

  ------------------------------------------------------------------------------------------
  Setting                             Value
  ----------------------------------- ------------------------------------------------------
  Root directory                      `frontend`

  Framework preset                    Vite

  Build command                       `npm run build`

  Output directory                    `dist`

  Environment variable                `VITE_API_URL=https://YOUR-BACKEND.onrender.com/api`
  ------------------------------------------------------------------------------------------

Connect the GitHub repository to Vercel and enable automatic deployments
for the production branch.

### Backend --- Render

The backend is deployed as a Docker-based Web Service. The Dockerfile is
located at `backend/Dockerfile`.

The Docker build context must match the paths used in the Dockerfile.
With `backend` as the build context, instructions such as
`COPY pom.xml .` and `COPY src ./src` are correct.

The runtime image includes `libpcap`, required by Pcap4J for the current
offline packet parsing implementation.

Configure `SPRING_DATASOURCE_*` in Render using the hosted PostgreSQL
database's internal connection details. Keep the backend and database in
the same Render region when using the internal database hostname.

### Database --- Render PostgreSQL

The production PostgreSQL database is hosted separately from the backend
service. The schema is applied from `database/init.sql`. The backend
connects to it over Render's internal network.

### CORS

The backend must allow requests from the deployed frontend origin. The
current Vercel production origin is:

``` text
https://net-scope-one.vercel.app
```

The local development origin is:

``` text
http://localhost:5173
```

If the Vercel domain changes, update the backend CORS configuration and
redeploy the backend. Avoid permissive wildcard origins in production.

## Current limitations

-   Analysis is based on uploaded PCAP/PCAPNG files; live interface
    capture is not implemented.
-   Flow extraction groups packets using the current flow-key
    implementation; it is not a full TCP session reconstruction engine.
-   The Anomalies and Analytics navigation areas are not yet complete
    analytical modules.
-   Authentication, user accounts, role-based access, and multi-tenant
    isolation are not currently part of the MVP.
-   Uploaded capture files are processed through temporary storage and
    deleted after processing; the original PCAP file is not retained as
    a downloadable archive.
-   Production monitoring, automated database migrations, and
    comprehensive automated test coverage remain areas for improvement.

## Planned updates

1.  **Richer traffic analytics** --- time-based traffic summaries,
    protocol distribution trends, top talkers, and more detailed flow
    filtering.
2.  **Anomaly detection** --- identify unusual traffic patterns and
    suspicious flow behaviour, with explainable indicators.
3.  **Flow exploration** --- searchable, sortable, and paginated flow
    tables with detailed flow views.
4.  **Capture management** --- improved capture history, metadata,
    deletion, and optional secure capture-file retention.
5.  **Export and reporting** --- downloadable summaries and structured
    analysis reports.
6.  **Security and access control** --- authentication, authorization,
    request validation, and rate limiting.
7.  **Operational hardening** --- database migrations, structured
    logging, health checks, metrics, automated tests, and deployment
    monitoring.
8.  **Live capture** --- investigate a separate capture agent or
    controlled host-level capture service; this requires
    operating-system permissions and should not be assumed to work
    inside a standard web container.

## Development workflow

GitHub is the source repository. With automatic deployments configured:

-   Pushing frontend changes to the production branch triggers a Vercel
    deployment.
-   Pushing backend changes triggers a Render Docker rebuild and
    deployment.
-   Database schema changes must be applied deliberately; deploying
    application code does not automatically migrate the database schema.

``` bash
git add .
git commit -m "Describe the change"
git push origin main
```

## Contributing

1.  Fork the repository or create a feature branch.
2.  Make focused changes and test them locally.
3.  Keep secrets and local environment files out of version control.
4.  Submit a pull request describing the change and how it was tested.

## License

No license is specified here. Add a `LICENSE` file before presenting the
project as open source or granting reuse rights.

------------------------------------------------------------------------

**NetScope** --- inspect packet captures, understand network flows, and
build a clearer picture of network activity.
