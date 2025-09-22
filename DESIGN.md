# EC2 REST Service: Pounds → Kilograms

**Name:** Braden Gant  
**Course Section:** CS454 – Cloud Computing  
**Due Date:** 09/24/2025  

---

## Introduction
The purpose of this project was to provision an AWS EC2 instance and deploy a small REST web service that converts pounds (lbs) into kilograms (kg). The service was implemented using **Node.js with Express** for simplicity in handling HTTP requests and generating JSON responses. To ensure reliability, the application runs under **systemd**, allowing it to automatically restart on failure and persist across reboots. Security best practices were followed by applying the **principle of least privilege** through restricted AWS Security Group rules, ensuring that only required ports were accessible and that the service did not run with elevated privileges.


## 1. Design Choices
### Runtime Environment
**AMI:** Amazon Linux 2023 was selected for the EC2 instance due to its long-term support.
**Instance Type:** t2.micro was selected as it met all requirements in the free tier.
**Framework:** Node.js with Express were used for simplicity in handling the REST endpoints and returning a JSON response.

### REST API Specification
- **200 OK:** Returns `{ lbs, kg, formula }` with kg rounded to three decimals.  
- **400 Bad Request:** Returned if the query parameter is missing, non-numeric.  
- **422 Unprocessable Entity:** Returned if the value is negative or non-finite.

### Reliability
The service is managed by a **systemd unit** (`p1.service`) which:  
- Starts the application automatically on boot.  
- Restarts the process upon failure.  
- Makes logs accessible through `journalctl`.

### Security
- **Security Groups:**  
  - **SSH (22):** Restricted to my IP address.  
  - **API (8080):** Restricted to my IP address.  
  - **HTTPS (443):** Removed to reduce attack surface since TLS is not required.
- **User Privileges:** The service runs as `ec2-user` rather than root.  
- **Key Pairs:** `.pem` files are not included in the repository. Each user must generate their own key pair when provisioning an instance.


### DevOps Practices
- **Logging:** Implemented with `morgan` for HTTP request visibility.
- **Documentation:** A complete `README.md` provides reproducible setup, run, test, and cleanup instructions.
- **Repository Hygiene:** `.gitignore` excludes sensitive files (`.pem`, `.env`) and large directories (`node_modules/`).

  
## 2. Testing
The following test cases were executed using 'curl', covering both valid input and output cases:
1. `/convert?lbs=0` --> `0.00 kg` 
2. `/convert?lbs=150` → `68.039 kg`
3. `/convert?lbs=0.1` → `0.045 kg`
4. `/convert` (missing param) → **400 Bad Request**
5. `/convert?lbs=-5` → **422 Unprocessable Entity**
6. `/convert?lbs=NaN` → **400 Bad Request**

## 3. Cost Hygiene
To ensure responsible use of AWS resources:
- The EC2 instance is stopped or terminated after use.
- Orphaned EBS volumes (AWS storage) and unused key pairs are deleted.
- Security Groups are removed when no longer needed, to reduce attack surface.


## 4. Conclusion
This design delivers a minimal but robust REST API that is hosted on AWS EC2. Using **Node.js/Express** simplified the service implementation, while **systemd** provided reliability. Applying the **principle of least privilege** through Security Groups and non-root execution reduced risk. Testing validated both functional and error-handling requirements, and cost hygiene practices ensured efficient use of cloud resources.
