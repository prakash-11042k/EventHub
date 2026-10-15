# Stage 1: Build the Spring Boot application using Maven and Java 17
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Cache Maven dependencies first to accelerate subsequent builds
COPY backend/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B || true

# Copy backend source code and compile the production JAR
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Lightweight, secure Java 17 runtime
FROM eclipse-temurin:17-jre

WORKDIR /app

# Run as a dedicated non-root user for container security
RUN useradd -r -u 1001 -g root eventhub || (addgroup --system --gid 1001 appgroup && adduser --system --uid 1001 --ingroup appgroup eventhub)

# Copy the compiled executable JAR from the builder stage
COPY --from=build --chown=1001:0 /app/target/*.jar app.jar

# Switch to unprivileged user
USER 1001

# Default port for Render Docker Web Services
ENV PORT=10000
EXPOSE 10000

# Launch with JVM container support, memory boundary tuning (75% of container RAM), and SIGTERM propagation
CMD ["sh", "-c", "exec java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-10000} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
