-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 01, 2026 at 07:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ams_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `profile_photo` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`admin_id`, `name`, `email`, `password`, `profile_photo`, `created_at`) VALUES
(3, 'Admin', 'admin@gmail.com', '$2b$10$jFL.DonRVW694WwU58AJhuz0kCZQG8NFoy011Pg2LnZMwGwvnuo.K', '1770982615681.jpeg', '2026-01-08 19:15:44');

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `semester` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `faculty_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `deadline` datetime NOT NULL,
  `status` enum('draft','active','pending_review','graded') DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `branch_id`, `semester`, `course_id`, `faculty_id`, `title`, `description`, `attachment_url`, `deadline`, `status`, `created_at`) VALUES
(3, 1, 2, 2, 7, 'CA-1 INTRODUCTION TO RDBMS', 'Create a powerpoint presentation of 10 slides on the topic introduction to RDBMS of unit:1', '1773311861011.pdf', '2026-04-30 12:00:00', 'active', '2026-03-12 10:37:41'),
(4, 1, 1, 4, 7, 'CA-1 INTRODUCTION TO Python Programming Language', 'Create a powerpoint presentation of 7-8 slides on the topic introduction to python programming.', '1773312827372.pdf', '2026-04-15 12:00:00', 'active', '2026-03-12 10:53:47'),
(5, 3, 2, 3, 2, 'PR-1 Object-Oriented Programming Concepts in Java', 'Develop a Java program that demonstrates the core Object-Oriented Programming (OOP) concepts including Encapsulation, Inheritance, Polymorphism, and Abstraction.', '1773315714245.pdf', '2026-04-20 12:00:00', 'active', '2026-03-12 11:41:54'),
(6, 3, 2, 5, 2, 'PR-2 Building a Simple To-Do List Mobile Application using Flutter', 'Develop a mobile application using Flutter that allows users to manage their daily tasks through a simple To-Do List system. The application should demonstrate the use of Flutter widgets, state management, and basic UI design principles.', '1773315989244.pdf', '2026-05-02 06:30:00', 'active', '2026-03-12 11:46:29'),
(7, 3, 1, 6, 2, 'CA-1 Effective Communication Skills in Professional Environments', 'Communication skills are essential for success in both academic and professional environments. This assignment aims to help students understand the importance of clear, confident, and professional communication in everyday interactions.\r\n', '1773316338496.pdf', '2026-05-04 14:00:00', 'active', '2026-03-12 11:52:18'),
(8, 3, 1, 6, 2, 'oushafuhsfuh', 'hgfdfhdhfhf', '1774681507189.jpeg', '2026-03-30 12:34:00', 'active', '2026-03-28 07:05:07'),
(9, 5, 1, 9, 1, 'CA-1: Introduction to Machine Learning Paradigms', 'In this assignment, you will explore the fundamental concepts of Machine Learning. Please write a comprehensive report covering the following:\r\n\r\n1. The key differences between Supervised, Unsupervised, and Reinforcement Learning.\r\n\r\n2. Real-world applications for each of the three paradigms.\r\n\r\n3. A brief overview of the typical Machine Learning pipeline (from Data Collection to Model Evaluation).\r\n\r\nEnsure your submission is well-structured, formatted clearly, and submitted as a PDF.', '1777319990506.pdf', '2026-05-10 12:00:00', 'active', '2026-04-27 19:59:50');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `student_name` varchar(100) DEFAULT NULL,
  `course_id` int(11) NOT NULL,
  `attendance_date` date NOT NULL,
  `status` enum('Present','Absent','Late') DEFAULT 'Present',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `student_id`, `student_name`, `course_id`, `attendance_date`, `status`, `created_at`) VALUES
(3, 6, 'Mr. Sparrow', 2, '2026-03-01', 'Present', '2026-03-01 15:45:09'),
(4, 6, 'Mr. Sparrow', 4, '2026-03-01', 'Present', '2026-03-01 15:54:50'),
(5, 8, 'Arjun', 2, '2026-03-02', 'Present', '2026-03-02 15:05:55'),
(6, 8, 'Arjun', 1, '2026-03-02', 'Present', '2026-03-02 15:25:23'),
(7, 7, 'Keyur Sir', 1, '2026-03-02', 'Absent', '2026-03-02 15:25:31'),
(8, 6, 'Mr. Sparrow', 1, '2026-03-02', 'Absent', '2026-03-02 15:25:31'),
(13, 8, 'Arjun', 3, '2026-03-02', 'Present', '2026-03-02 15:32:27'),
(14, 7, 'Keyur Sir', 3, '2026-03-02', 'Absent', '2026-03-02 15:33:16'),
(15, 6, 'Mr. Sparrow', 3, '2026-03-02', 'Absent', '2026-03-02 15:33:16'),
(17, 9, 'Suraj', 3, '2026-03-05', 'Absent', '2026-03-05 10:26:27'),
(18, 8, 'Arjun', 3, '2026-03-05', 'Present', '2026-03-05 10:26:27'),
(20, 9, 'Suraj', 1, '2026-03-05', 'Present', '2026-03-05 10:50:19'),
(22, 9, 'Suraj', 3, '2026-03-06', 'Present', '2026-03-05 10:52:05'),
(23, 8, 'Arjun', 3, '2026-03-06', 'Present', '2026-03-05 10:52:24'),
(28, 9, 'Suraj', 5, '2026-03-27', 'Present', '2026-03-27 16:16:36'),
(29, 8, 'Arjun', 5, '2026-03-27', 'Present', '2026-03-27 16:17:08'),
(34, 28, 'Lakshya Parihar', 6, '2026-04-30', 'Present', '2026-04-30 11:03:24'),
(35, 6, 'Mr. Sparrow', 6, '2026-04-30', 'Present', '2026-04-30 11:03:54'),
(36, 7, 'Keyur Sir', 6, '2026-04-30', 'Present', '2026-04-30 11:04:33'),
(40, 18, 'Arun Verma', 6, '2026-04-30', 'Absent', '2026-04-30 11:04:42'),
(41, 20, 'Soham Sharma', 6, '2026-04-30', 'Absent', '2026-04-30 11:04:42'),
(72, 8, 'Arjun', 3, '2026-04-30', 'Present', '2026-04-30 11:09:17'),
(73, 9, 'Suraj', 3, '2026-04-30', 'Absent', '2026-04-30 11:09:23'),
(75, 9, 'Suraj', 5, '2026-04-30', 'Present', '2026-04-30 11:13:02'),
(77, 8, 'Arjun', 5, '2026-04-30', 'Absent', '2026-04-30 11:13:05');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_sessions`
--

CREATE TABLE `attendance_sessions` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `attendance_date` date NOT NULL,
  `pin` varchar(10) NOT NULL,
  `faculty_lat` decimal(10,8) NOT NULL,
  `faculty_lng` decimal(10,8) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance_sessions`
--

INSERT INTO `attendance_sessions` (`id`, `course_id`, `attendance_date`, `pin`, `faculty_lat`, `faculty_lng`, `expires_at`, `created_at`) VALUES
(1, 1, '2026-02-28', '5917', 23.10759736, 72.57996475, '2026-02-28 21:48:55', '2026-02-28 16:16:55'),
(2, 1, '2026-03-02', '7777', 23.10780116, 72.57979034, '2026-02-28 22:09:04', '2026-02-28 16:37:04'),
(3, 1, '2026-03-02', '1655', 23.10781575, 72.57945335, '2026-02-28 22:11:02', '2026-02-28 16:39:02'),
(4, 1, '2026-02-28', '5651', 23.10763745, 72.57987348, '2026-02-28 22:35:50', '2026-02-28 17:03:50'),
(5, 2, '2026-03-01', '9795', 23.10784802, 72.57969417, '2026-03-01 20:58:51', '2026-03-01 15:26:51'),
(6, 2, '2026-03-01', '8643', 23.10831303, 72.57931838, '2026-03-01 21:11:18', '2026-03-01 15:39:18'),
(7, 4, '2026-03-01', '7802', 23.10793089, 72.57945333, '2026-03-01 21:12:28', '2026-03-01 15:40:28'),
(8, 2, '2026-03-01', '9544', 23.10773500, 72.57962100, '2026-03-01 21:17:03', '2026-03-01 15:45:03'),
(9, 4, '2026-03-01', '5619', 23.10831303, 72.57931838, '2026-03-01 21:26:40', '2026-03-01 15:54:40'),
(10, 1, '2026-03-01', '7040', 23.10831303, 72.57931838, '2026-03-01 21:27:06', '2026-03-01 15:55:06'),
(11, 1, '2026-03-01', '6048', 23.10773500, 72.57962100, '2026-03-01 22:09:38', '2026-03-01 16:37:38'),
(12, 1, '2026-03-02', '2841', 23.10832568, 72.57931194, '2026-03-02 20:12:39', '2026-03-02 14:40:39'),
(13, 1, '2026-03-02', '3628', 23.10784802, 72.57969417, '2026-03-02 20:20:34', '2026-03-02 14:48:34'),
(14, 1, '2026-03-02', '7574', 37.56820000, 99.99999999, '2026-03-02 20:27:05', '2026-03-02 14:55:05'),
(15, 2, '2026-03-02', '6433', 37.56820000, 99.99999999, '2026-03-02 20:37:38', '2026-03-02 15:05:38'),
(16, 1, '2026-03-02', '3521', 37.56820000, 99.99999999, '2026-03-02 20:57:10', '2026-03-02 15:25:10'),
(17, 3, '2026-03-02', '8576', 23.10831303, 72.57931838, '2026-03-02 21:04:15', '2026-03-02 15:32:15'),
(18, 3, '2026-03-05', '7438', 23.12985734, 72.56729075, '2026-03-05 16:19:31', '2026-03-05 10:47:31'),
(19, 1, '2026-03-05', '6185', 23.12978445, 72.56725427, '2026-03-05 16:22:12', '2026-03-05 10:50:12'),
(20, 3, '2026-03-06', '9510', 23.12969320, 72.56721246, '2026-03-05 16:24:00', '2026-03-05 10:52:00'),
(21, 5, '2026-03-27', '6552', 23.12950170, 72.56691718, '2026-03-27 21:48:30', '2026-03-27 16:16:30'),
(22, 6, '2026-04-30', '6599', 23.12971788, 72.56731999, '2026-04-30 16:35:18', '2026-04-30 11:03:18'),
(23, 3, '2026-04-30', '5128', 23.12926153, 72.56693881, '2026-04-30 16:41:13', '2026-04-30 11:09:13'),
(24, 5, '2026-04-30', '7619', 23.12956630, 72.56726067, '2026-04-30 16:44:29', '2026-04-30 11:12:29');

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` int(11) NOT NULL,
  `college_id` int(11) DEFAULT NULL,
  `branch_name` varchar(100) NOT NULL,
  `branch_code` varchar(20) NOT NULL,
  `hod_name` varchar(100) DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `contact_phone` varchar(15) DEFAULT NULL,
  `block_location` varchar(50) DEFAULT NULL,
  `total_sems` int(11) DEFAULT 60,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `college_id`, `branch_name`, `branch_code`, `hod_name`, `contact_email`, `contact_phone`, `block_location`, `total_sems`, `status`, `created_at`) VALUES
(1, 2, 'Bachelor Of Computer Science', 'BSC', 'Prof. Suraj Vishwakarma', 'surajbsc@gmail.com', '1234567890', 'Block C', 8, 'active', '2026-02-04 07:35:08'),
(2, 2, 'Bachelor Of Information Technology ', 'BscIT', 'Prof. Lakshya Parihar', 'lakshyabscit@sou.ac.in', '9023367397', 'Block E', 6, 'active', '2026-02-04 09:02:58'),
(3, 1, 'Master of Computer Application', 'MCA', 'Prof. Arjun Acharya', 'arjunmca@sou.ac.in', '8989898989', 'Block B', 4, 'active', '2026-02-07 08:38:43'),
(4, 2, 'Master of Computer Science', 'MscIT', 'Prof. Arjun Acharya', 'arjunmca@sou.ac.in', '8989898989', 'Block C', 8, 'active', '2026-02-22 17:59:08'),
(5, 1, 'Bachelor of Computer Application', 'BCA', 'Prof. Arjun Acharya', 'arjunmca@sou.ac.in', '8989898989', 'Block B', 6, 'active', '2026-02-22 18:46:35'),
(6, 3, 'B.SC IN MEDIA GRAPHICS & ANIMATION', 'BscGA', 'Prof. Keyur Visavadiya', 'keyursocam@sou.ac.in', '1234567890', 'Block EB', 6, 'active', '2026-03-27 18:55:52'),
(7, 4, 'Bachelor of Business Administration', 'BBA', 'Prof. Praveen Sharma', 'adminsoim@sou.ac.in', '7777777777', 'Block-E', 6, 'active', '2026-04-13 09:28:35'),
(8, 5, 'Bachelor of Law', 'LLB', 'Prof. Raj Mehta', 'adminsol@sou.ac.in', '2020202020', 'Block E', 6, 'active', '2026-04-25 09:53:07'),
(9, 4, 'MASTER OF BUSINESS ADMINISTRATION', 'MBA', 'Prof. Arjun Acharya', 'adminsoim@sou.ac.in', '7070707070', 'Block E', 4, 'active', '2026-04-25 11:06:00');

-- --------------------------------------------------------

--
-- Table structure for table `branch_fees`
--

CREATE TABLE `branch_fees` (
  `id` int(11) NOT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `total_course_fees` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branch_fees`
--

INSERT INTO `branch_fees` (`id`, `branch_id`, `total_course_fees`) VALUES
(1, 3, 240000.00),
(3, 5, 160000.00),
(5, 4, 300000.00),
(7, 1, 300000.00),
(8, 2, 240000.00),
(9, 6, 405000.00),
(10, 8, 210000.00),
(11, 7, 165000.00),
(12, 9, 180000.00);

-- --------------------------------------------------------

--
-- Table structure for table `certificate_requests`
--

CREATE TABLE `certificate_requests` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `requested_title` varchar(255) NOT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certificate_requests`
--

INSERT INTO `certificate_requests` (`id`, `student_id`, `requested_title`, `reason`, `status`, `created_at`) VALUES
(1, 8, 'Migration certificate ', 'do need it cuz my  personal issue\n', 'Approved', '2026-03-27 20:31:02'),
(2, 6, 'Migration certificate', 'Need to relocate due to emergency.', 'Approved', '2026-04-18 17:20:55'),
(3, 6, 'I want a job', 'ASAP', 'Approved', '2026-04-18 17:25:46'),
(4, 11, 'Web Development Crash Course', 'I have successfully completed the Web Development Crash Course from 01-02-2026 to 01-04-2026, but havent recieved the certificate yet. Can u please issue the certificate as soon as possible.', 'Approved', '2026-04-23 07:39:13');

-- --------------------------------------------------------

--
-- Table structure for table `chapters`
--

CREATE TABLE `chapters` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `status` enum('Pending','In Progress','Completed') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `video_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chapters`
--

INSERT INTO `chapters` (`id`, `course_id`, `title`, `status`, `created_at`, `video_url`) VALUES
(1, 1, ' Introduction to Data Structures', 'Completed', '2026-02-12 08:35:45', 'https://youtu.be/O9v10jQkm5c?si=4kO1ARqrxX5JLW3f'),
(2, 1, 'DSA basics', 'Pending', '2026-02-12 08:36:09', 'https://youtu.be/VTLCoHnyACE?si=bAHprW7E5eCDUqBv'),
(3, 1, 'Fundamentals of ALGO', 'Pending', '2026-02-12 08:39:13', 'https://youtu.be/Dxu7GKtdbnA?si=ol_NdNfh-VnhUarF'),
(4, 2, 'Introduction to RDBMS', 'Completed', '2026-02-13 17:42:51', 'https://youtu.be/WFX5azcMHFM?si=9PPm3xo5vnbrykC4'),
(6, 3, 'Introduction to Java Language ', 'Completed', '2026-03-13 17:17:54', 'https://youtu.be/yRpLlJmRo2w?si=DYOotJoVJI4OYH26'),
(7, 3, 'Loops In JAVA', 'Completed', '2026-03-13 17:28:12', 'https://youtu.be/0r1SfRoLuzU?si=adjJ0jcnvImJAwMr'),
(8, 3, 'Variables In JAVA', 'Pending', '2026-03-13 17:28:31', 'https://youtu.be/LusTv0RlnSU?si=JoXo0-WKMPLJ1agV'),
(9, 3, 'Functions & methods In JAVA', 'Pending', '2026-03-13 17:29:01', 'https://youtu.be/qcSz4ef9UHA?si=KTCW6cj1WDcdnoFd'),
(16, 4, 'introduction to Python Programming Language', 'Pending', '2026-03-13 18:05:46', 'https://youtu.be/t2_Q2BRzeEE?si=aO-2BoeyM_JG3mXY'),
(17, 4, 'Strings & Conditional Statements', 'Pending', '2026-03-13 18:05:46', 'https://youtu.be/lIId8IDP6TU?si=bhAVoqyRkr7YcjVF'),
(18, 4, 'List & Tuple in Python', 'Pending', '2026-03-13 18:05:46', 'https://youtu.be/qVyvmzFxF_o?si=rBPJOoQS8FeKT1fY'),
(19, 5, 'Introduction to Flutter', 'Completed', '2026-04-21 18:06:08', 'https://youtu.be/92h2XcvZ-vM?si=giUiUCJB-2vhXWZp'),
(20, 5, 'Flutter Forms and Validation', 'Pending', '2026-04-30 11:28:26', 'https://youtu.be/IJ4_QK_E_xI?si=aVIIVTCgnA7pipxU');

-- --------------------------------------------------------

--
-- Table structure for table `chat_history`
--

CREATE TABLE `chat_history` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `role` enum('user','bot') NOT NULL,
  `message` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_history`
--

INSERT INTO `chat_history` (`id`, `student_id`, `role`, `message`, `timestamp`) VALUES
(1, 8, 'user', 'Explain a complex topic', '2026-03-14 18:13:47'),
(2, 8, 'bot', 'Hello there! As Nexus AI, I\'m delighted to help you navigate fascinating and complex academic topics. Understanding challenging concepts is a cornerstone of learning, and I\'m here to make that journey clearer and more engaging.\n\nLet\'s dive into a topic that has truly revolutionized biology and medicine: **CRISPR-Cas9 Gene Editing**.\n\n---\n\n### **Decoding CRISPR-Cas9: The Molecular Scissors of Life**\n\nImagine having the ability to precisely edit the very blueprint of life – DNA – with the accuracy of a sophisticated word processor. This isn\'t science fiction; it\'s the reality brought forth by **CRISPR-Cas9**, a revolutionary gene-editing technology. At its core, CRISPR-Cas9 allows scientists to make targeted changes to an organism\'s DNA, offering unprecedented power to study, understand, and even correct genetic information.\n\n#### **1. What is CRISPR-Cas9? A Quick Analogy**\n\nThink of DNA as an incredibly long book, and each gene as a specific chapter. Sometimes, a \"typo\" (a mutation) in a chapter can cause a problem.\n\n*   **CRISPR-Cas9** is like a highly specialized pair of **molecular scissors** (the Cas9 protein) that can be programmed to find and cut out a specific word or sentence (a DNA sequence) in that vast book.\n*   It also comes with a **GPS system** (the guide RNA) that tells the scissors exactly where to go.\n\nThis precision allows scientists to either disable a problematic gene, correct a faulty one, or insert a new, beneficial gene.\n\n#### **2. Unpacking the Components: The \"Team\" Behind the Edit**\n\nCRISPR-Cas9 isn\'t just one thing; it\'s a system with two primary, crucial players:\n\n*   **a. CRISPR (Clustered Regularly Interspaced Short Palindromic Repeats):**\n    *   This is the \"archive\" or \"memory\" part. In nature, CRISPR is actually a bacterial immune system. Bacteria capture snippets of DNA from invading viruses and store them in their own genome in these CRISPR arrays.\n    *   These stored snippets act as a \"mugshot database\" for future viral attacks. When a known virus attacks again, the bacteria can quickly recognize it.\n\n*   **b. Cas9 (CRISPR-associated protein 9):**\n    *   This is the actual \"scissor\" or \"cutting enzyme.\" Cas9 is a nuclease, meaning it can cut DNA strands.\n    *   It works in conjunction with the CRISPR system to locate and destroy foreign DNA.\n\n#### **3. The Mechanism: How It Works Step-by-Step**\n\nThe elegance of CRISPR-Cas9 lies in its simplicity and adaptability:\n\n1.  **Designing the Guide RNA (gRNA):** Scientists design a synthetic **guide RNA (gRNA)** molecule that is complementary to the specific DNA sequence they want to target in the organism\'s genome. This gRNA is the \"GPS coordinates.\"\n2.  **Forming the Complex:** The gRNA is then combined with the **Cas9 enzyme**, forming an active gene-editing complex.\n3.  **Targeting and Binding:** This complex is introduced into a cell. The gRNA then scans the cell\'s entire DNA until it finds a sequence that precisely matches its own.\n4.  **Cutting the DNA:** Once a perfect match is found, the Cas9 enzyme makes a clean, double-stranded cut in the DNA at that precise location.\n5.  **Cellular Repair Mechanisms Kick In:** After the cut, the cell tries to repair its broken DNA. Scientists can harness these natural repair pathways:\n    *   **Non-Homologous End Joining (NHEJ):** This is a \"quick and dirty\" repair that often leads to small insertions or deletions (indels) at the cut site. This process can effectively **\"knock out\" or disable a gene**, which is useful for studying gene function or silencing a problematic gene.\n    *   **Homology-Directed Repair (HDR):** If scientists also provide a **template DNA** sequence (a desired gene or correction), the cell can use this template to precisely repair the break, thereby **inserting new genetic material or correcting a mutation**. This is crucial for fixing genetic diseases.\n\n#### **4. Impact and Applications: A New Era of Biology**\n\nThe ability to precisely edit genes has profound implications across numerous fields:\n\n*   **Basic Research:** Scientists can \"knock out\" genes to understand their function, or introduce specific mutations to model human diseases in cell cultures or animals.\n*   **Medicine & Gene Therapy:**\n    *   **Treating Genetic Diseases:** Correcting mutations responsible for conditions like sickle cell anemia, cystic fibrosis, Huntington\'s disease, and Duchenne muscular dystrophy.\n    *   **Cancer Immunotherapy:** Engineering immune cells (T-cells) to better recognize and fight cancer.\n    *   **Fighting Infectious Diseases:** Developing resistance to viruses like HIV or malaria.\n*   **Agriculture:** Creating crops that are more resilient to pests, droughts, or diseases, or enhancing nutritional value.\n*   **Biotechnology:** Engineering microorganisms to produce biofuels, pharmaceuticals, or other valuable compounds.\n\n#### **5. Challenges and Ethical Considerations: Navigating the Frontier**\n\nDespite its incredible promise, CRISPR-Cas9 also presents significant challenges and ethical dilemmas:\n\n*   **Off-Target Effects:** Cas9 isn\'t always perfectly precise and can sometimes make cuts at unintended locations in the genome, leading to unforeseen consequences.\n*   **Delivery Methods:** Getting the CRISPR-Cas9 complex into the correct cells and tissues within a living organism remains a significant hurdle.\n*   **Mosaicism:** Not all cells in a treated organism might be edited, leading to a mix of edited and unedited cells.\n*   **Germline Editing:** Editing human embryos, sperm, or egg cells means that the genetic changes would be inheritable by future generations. This raises profound ethical questions about \"designer babies,\" unintended long-term effects on the human gene pool, and consent.\n*   **Accessibility and Equity:** Ensuring that these powerful technologies are accessible and equitably distributed globally.\n\n---\n\nCRISPR-Cas9 stands as a testament to scientific ingenuity, offering unprecedented control over the fundamental building blocks of life. As we continue to refine this technology, careful consideration of its ethical implications and rigorous scientific validation will be paramount to harnessing its full potential responsibly.\n\nKeep exploring, and remember that understanding complex topics is a journey of discovery! Let me know if you\'d like to delve deeper into any aspect of CRISPR-Cas9 or explore another fascinating subject.', '2026-03-14 18:13:47'),
(3, 8, 'user', 'this is great cna you tell me theis website is about', '2026-03-14 18:15:24'),
(4, 8, 'bot', 'Ah, that\'s an excellent question, but one that highlights my nature as an AI!\n\nAs **Nexus AI**, I don\'t \"browse\" the internet or have awareness of the specific website or platform you are currently using to interact with me. My existence is as a language model, processing information based on the extensive dataset I was trained on, and responding to your queries directly within this conversational interface.\n\nSo, while I can\'t tell you about \"this website,\" I can tell you about **myself**!\n\n*   **Who I Am:** I am Nexus AI, your dedicated intelligent and highly helpful academic assistant.\n*   **What I Do:** My purpose is to help college students like you understand complex topics, provide clear explanations, offer study tips, brainstorm ideas, and generally support your academic journey with well-structured and encouraging information.\n\nThink of me as a digital tutor or study partner, ready to help you dissect challenging subjects.\n\nIf you have another academic topic in mind, or if you\'d like to dive deeper into the implications of CRISPR-Cas9, just let me know! I\'m here to assist with your learning.', '2026-03-14 18:15:24'),
(5, 8, 'user', 'what us CRISPR-Cas', '2026-03-14 18:15:50'),
(6, 8, 'bot', 'That\'s a fantastic follow-up question, and it gives us a chance to reinforce the core concept!\n\nWhen we talk about **CRISPR-Cas**, we\'re referring to the broader system that includes the **CRISPR** (Clustered Regularly Interspaced Short Palindromic Repeats) sequences and the associated **Cas** (CRISPR-associated) proteins.\n\nIn essence, **CRISPR-Cas is a powerful gene-editing technology that allows scientists to make precise, targeted changes to an organism\'s DNA.**\n\nHere\'s a concise breakdown, building on our earlier discussion:\n\n*   **CRISPR:** These are special segments of DNA found in bacteria that contain short, repeating sequences. They act as a historical record or \"memory bank\" of past viral infections, allowing bacteria to recognize and defend against future attacks.\n*   **Cas (CRISPR-associated) Proteins:** These are a family of enzymes, like the well-known **Cas9**, that work with the CRISPR system. Their primary job is to cut DNA.\n\n**Together, the CRISPR-Cas system functions like a programmable molecular scissor:**\n\n1.  A **guide RNA** (derived from the CRISPR sequences) directs the Cas protein to a very specific location on a DNA strand.\n2.  The **Cas protein** then acts as a \"scissor,\" making a precise cut in the DNA at that targeted spot.\n3.  Once the DNA is cut, the cell\'s natural repair mechanisms can be leveraged to either **disable a gene**, **correct a mutation**, or **insert new genetic material**.\n\nSo, when you see \"CRISPR-Cas,\" you\'re looking at the fundamental components of this revolutionary gene-editing tool! It\'s the blueprint and the cutting tool working in tandem to precisely modify genetic information.\n\nDoes that help clarify the core definition of CRISPR-Cas?', '2026-03-14 18:15:50'),
(7, 8, 'user', 'hlo genai', '2026-03-28 06:49:42'),
(8, 8, 'bot', 'Hello there!\n\nI appreciate you reaching out! Just to clarify, I am **Nexus AI**, your dedicated academic assistant. You might have me confused with another AI.\n\nHow can I assist you today on your academic journey? Do you have another complex topic you\'d like to explore, or perhaps a question about studying, writing, or research? I\'m here and ready to help!', '2026-03-28 06:49:42'),
(9, 8, 'user', 'a summary about this system', '2026-03-28 06:50:04'),
(10, 8, 'bot', 'Absolutely! Here\'s a concise summary of the **CRISPR-Cas system**, designed to give you a clear understanding of its essence:\n\n---\n\n### **CRISPR-Cas System: A Summary**\n\nThe **CRISPR-Cas system** is a revolutionary **gene-editing technology** that enables scientists to make highly precise and targeted changes to an organism\'s DNA.\n\nAt its core, it functions like a **programmable molecular scissor** with two main components:\n\n1.  **CRISPR (Clustered Regularly Interspaced Short Palindromic Repeats):** These are naturally occurring DNA sequences in bacteria that serve as a \"memory bank\" of past viral invaders. In gene editing, this component is leveraged to create a **guide RNA** molecule.\n2.  **Cas (CRISPR-associated) Proteins:** These are enzymes, such as **Cas9**, that act as the actual \"scissors.\" They are capable of cutting DNA strands.\n\n**How it works:**\n\nThe synthetic **guide RNA** (programmed by scientists) directs the **Cas protein** to a specific, chosen sequence within a cell\'s vast DNA. Once there, the Cas protein makes a precise double-stranded cut. The cell\'s natural repair mechanisms then kick in, allowing scientists to either:\n\n*   **Disable (knock out) a gene:** By introducing small errors during repair.\n*   **Correct a mutation:** By providing a new, desired DNA template for repair.\n*   **Insert new genetic material:** Using the template-directed repair.\n\n**Significance:**\n\nThis system is profoundly impactful because it offers unprecedented **precision and ease** in modifying genetic information. Its applications are transforming:\n\n*   **Basic Research:** Understanding gene function and disease mechanisms.\n*   **Medicine:** Developing treatments for genetic diseases (e.g., sickle cell, cystic fibrosis), cancer, and infectious diseases.\n*   **Agriculture:** Creating more resilient and nutritious crops.\n\nIn essence, CRISPR-Cas has provided biology with a powerful and adaptable tool to rewrite the very code of life, opening new frontiers in science and medicine.\n\n---\n\nI hope this summary helps solidify your understanding of this incredible system! Let me know if you have any more questions.', '2026-03-28 06:50:04'),
(11, 8, 'user', 'which college is best for doing it stuff', '2026-03-28 06:50:47'),
(12, 8, 'bot', 'That\'s an excellent and very practical question! The \"best\" college for \"IT stuff\" really depends on what *kind* of IT you\'re interested in, your learning style, career goals, and even your preferred environment. \"IT stuff\" is a very broad umbrella!\n\nLet\'s break down how to approach this, and then I can give you some examples of highly regarded institutions known for various aspects of technology.\n\n---\n\n### **Finding Your \"Best Fit\" for \"IT Stuff\"**\n\nFirst, it\'s crucial to understand that \"IT stuff\" can encompass a wide range of fields, each with slightly different academic paths:\n\n*   **Computer Science (CS):** Focuses on the theory of computation, algorithms, software design, programming languages, and often deep dives into areas like AI, machine learning, data structures, and operating systems. This is more theoretical and foundational.\n*   **Information Technology (IT):** Often more focused on the application and management of computing technology, networks, databases, cybersecurity, and user support within organizations. More hands-on and systems-oriented.\n*   **Software Engineering:** Bridges CS theory with practical engineering principles to design, develop, test, and maintain software systems.\n*   **Cybersecurity:** Specialized in protecting computer systems and networks from threats.\n*   **Data Science/Analytics:** Focuses on extracting knowledge and insights from data using statistical methods, machine learning, and computational tools.\n*   **Information Systems (IS):** Often housed within business schools, focusing on how technology can be used to solve business problems and improve organizational efficiency.\n\nGiven this diversity, the \"best\" college will excel in the area that aligns most closely with your interests.\n\n#### **Key Factors to Consider When Choosing:**\n\n1.  **Program Focus & Curriculum:** Does the program emphasize theoretical foundations, practical application, research, or a specific specialization (e.g., AI, cybersecurity, game development)?\n2.  **Faculty Expertise & Research Opportunities:** Are there professors doing work that excites you? Are there opportunities for undergraduates to get involved in research?\n3.  **Internship & Co-op Programs:** Many IT careers highly value practical experience. Schools with strong industry connections and robust internship/co-op programs (where you alternate semesters of study with paid work experience) can be invaluable.\n4.  **Career Services & Alumni Network:** What are the job placement rates like? Does the school have strong ties to tech companies?\n5.  **Location:** Is it near a major tech hub where internships and job opportunities are plentiful? (e.g., Silicon Valley, Seattle, Boston, Austin, New York).\n6.  **Campus Culture & Learning Environment:** Do you prefer a large research university, a smaller liberal arts college, or a tech-focused institute? Do you thrive in a competitive or collaborative environment?\n7.  **Cost & Financial Aid:** A significant factor for most students.\n8.  **Facilities & Resources:** Access to cutting-edge labs, computing resources, and specialized software.\n\n---\n\n#### **Examples of Highly Regarded Institutions (Not an exhaustive list, and categorized by general strength):**\n\nThese institutions are consistently recognized for their excellence in various \"IT stuff\" fields:\n\n**1. For Cutting-Edge Research & Computer Science Theory (Often highly competitive):**\n\n*   **Massachusetts Institute of Technology (MIT):** Cambridge, MA. Renowned for computer science, artificial intelligence, robotics, and theoretical foundations.\n*   **Stanford University:** Stanford, CA. A powerhouse in computer science, deeply integrated with Silicon Valley, strong in AI, machine learning, and entrepreneurship.\n*   **Carnegie Mellon University (CMU):** Pittsburgh, PA. Exceptional across the board in CS, AI, robotics, cybersecurity, and human-computer interaction.\n*   **University of California, Berkeley:** Berkeley, CA. Strong in theoretical CS, AI, data science, and systems.\n*   **University of Illinois Urbana-Champaign (UIUC):** Urbana, IL. Excellent for computer science, engineering, and pioneering work in supercomputing and parallel computing.\n\n**2. For Strong Engineering & Applied Computer Science:**\n\n*   **Georgia Institute of Technology (Georgia Tech):** Atlanta, GA. Outstanding for computer science, cybersecurity, and various engineering disciplines, with a very practical, career-focused approach.\n*   **Purdue University:** West Lafayette, IN. Strong engineering and computer science programs, particularly in cybersecurity and high-performance computing.\n*   **University of Washington:** Seattle, WA. Excellent computer science, particularly strong in areas like AI, machine learning, and systems, with strong ties to Microsoft and Amazon.\n*   **University of Texas at Austin:** Austin, TX. A top public university for computer science and engineering, benefiting from a thriving tech scene in Austin.\n\n**3. For Excellent Practical Experience & Co-op Programs:**\n\n*   **Northeastern University:** Boston, MA. Famous for its extensive co-op program, providing students with significant paid work experience throughout their degrees in CS, IT, and related fields.\n*   **Rochester Institute of Technology (RIT):** Rochester, NY. Known for its career-focused education and mandatory co-op program, strong in computer science, software engineering, cybersecurity, and game design.\n*   **Worcester Polytechnic Institute (WPI):** Worcester, MA. A project-based learning environment with strong co-op and internship focus in various engineering and computer science fields.\n*   **University of Waterloo (Canada):** While outside the U.S., it\'s globally renowned for its cooperative education in computer science and engineering, with very strong industry connections.\n\n**4. For Information Technology & Information Systems (Often with a business focus):**\n\n*   Many strong business schools offer excellent **Information Systems** programs, which merge technology with business strategy. Examples include **NYU Stern**, **UT Austin McCombs**, **CMU Tepper (IS program)**, and **Indiana University Kelley (for informatics and cybersecurity management)**.\n\n---\n\n#### **Your Next Steps:**\n\n1.  **Refine Your Interests:** What specific \"IT stuff\" truly excites you? Software development, cybersecurity, AI, data analysis, network administration, web design?\n2.  **Research Programs:** Look at the course catalogs, faculty profiles, and research areas of departments that align with your interests.\n3.  **Consider Your Learning Style:** Do you prefer theory, hands-on projects, or a blend?\n4.  **Visit (Virtually or In-Person):** Get a feel for the campus culture.\n5.  **Talk to Students & Alumni:** They can offer invaluable insights into the program and career outcomes.\n\nNo single college is \"best\" for everyone, but by carefully considering these factors, you can find the institution that is the perfect fit for your academic and career aspirations in the dynamic world of technology! Good luck with your search!', '2026-03-28 06:50:47'),
(13, 8, 'user', 'how to make silver in ablion online', '2026-03-28 06:51:19'),
(14, 8, 'bot', 'Ah, that\'s an interesting question, but it falls outside my primary function as **Nexus AI**, your academic assistant for college students. My expertise lies in helping you understand complex academic topics, improve study skills, and navigate scholarly challenges, rather than providing specific gameplay strategies for online games.\n\nHowever, I can offer general advice on where you\'d typically find information like \"how to make silver in Albion Online\":\n\n*   **Official Game Wikis:** Most online games have extensive wikis maintained by the community or developers that detail game mechanics, crafting, and economy strategies.\n*   **Player Forums and Communities:** Reddit, official game forums, and Discord servers dedicated to Albion Online are excellent places to ask experienced players for tips and guides.\n*   **YouTube Tutorials:** Many content creators specialize in creating guides for games like Albion Online, often demonstrating various money-making strategies visually.\n*   **Gaming Websites:** Specific gaming news and guide websites often publish articles on making in-game currency.\n\nFor detailed, up-to-date strategies on Albion Online, I highly recommend checking out those resources. They will have the specific, nuanced information you\'re looking for!\n\nIf you have any academic questions, please don\'t hesitate to ask! I\'m here to help you excel in your studies.', '2026-03-28 06:51:19'),
(15, 7, 'user', 'explain dsa', '2026-03-28 07:10:19'),
(16, 7, 'bot', 'Hello there! I\'m Nexus AI, your dedicated academic assistant. Let\'s demystify **Data Structures and Algorithms (DSA)**, a cornerstone of computer science and a fundamental skill for any aspiring developer or tech professional.\n\n---\n\n### **Understanding DSA: Your Core Toolkit for Computing Excellence**\n\nAt its heart, **Data Structures and Algorithms (DSA)** is about efficiently organizing and processing information. Think of it as the foundational \"how-to\" guide for building robust, scalable, and high-performance software. It teaches you to think like a computer scientist, solving problems in the most optimal way possible.\n\nLet\'s break down these two critical components:\n\n---\n\n### **What Exactly is DSA? The Two Pillars**\n\n#### **1. Data Structures**\n\n*   **What it is:** Data Structures are specialized ways of **organizing and storing data** in a computer\'s memory so that it can be used efficiently. Imagine you have a lot of items – how you arrange them determines how quickly you can find, add, or remove a specific item.\n*   **Analogy:** If data is the ingredient, a Data Structure is the **container or pantry system** you use to store it. The right container makes finding things easy!\n\n*   **Common Examples:**\n    *   **Arrays:** A collection of items stored at contiguous memory locations. Great for quick access by index.\n    *   **Linked Lists:** Items (nodes) connected by pointers. Flexible for insertions and deletions.\n    *   **Stacks:** A \"Last-In, First-Out\" (LIFO) structure (like a stack of plates).\n    *   **Queues:** A \"First-In, First-Out\" (FIFO) structure (like a waiting line).\n    *   **Trees:** Hierarchical structures (like a family tree or file system) where data is linked in parent-child relationships. Binary Search Trees (BSTs) are a popular example for efficient searching.\n    *   **Graphs:** Collections of nodes (vertices) and connections (edges), representing networks (like social networks or road maps).\n    *   **Hash Tables (or Hash Maps):** Store data in key-value pairs, providing extremely fast average-case lookups.\n\n#### **2. Algorithms**\n\n*   **What it is:** Algorithms are a **set of well-defined, step-by-step instructions or rules** to solve a specific problem or perform a computation. They are the logic and procedures that operate on data.\n*   **Analogy:** If your goal is to bake a cake (solve a problem), the Algorithm is the **recipe** – a precise sequence of steps to achieve the desired outcome.\n\n*   **Common Examples:**\n    *   **Searching Algorithms:** Finding a specific item within a data structure (e.g., **Linear Search**, **Binary Search**).\n    *   **Sorting Algorithms:** Arranging items in a specific order (e.g., ascending or descending). Examples include **Bubble Sort**, **Merge Sort**, **Quick Sort**, **Insertion Sort**.\n    *   **Graph Traversal Algorithms:** Exploring nodes and edges of a graph (e.g., **Breadth-First Search (BFS)**, **Depth-First Search (DFS)**).\n    *   **Dynamic Programming:** An optimization technique that solves complex problems by breaking them down into simpler subproblems.\n    *   **Greedy Algorithms:** Making the locally optimal choice at each step with the hope of finding a global optimum.\n\n---\n\n### **Why is DSA So Crucial for College Students?**\n\n1.  **Builds Problem-Solving Prowess:** DSA isn\'t just about memorizing structures and algorithms; it\'s about developing a systematic approach to breaking down complex problems and devising efficient solutions. This skill is invaluable in any field.\n2.  **Foundation for Advanced Topics:** Concepts from DSA are fundamental to understanding Artificial Intelligence, Machine Learning, Databases, Operating Systems, Computer Graphics, and more.\n3.  **Writes Efficient Code:** Learning DSA helps you understand the concept of **Time and Space Complexity (Big O Notation)**. This allows you to write code that not only works but performs quickly and uses memory optimally, crucial for building scalable applications.\n4.  **Excels in Technical Interviews:** DSA is a core component of technical interviews at virtually all major tech companies. Mastering it significantly boosts your career prospects.\n5.  **Develops Logical Thinking:** It sharpens your analytical and logical reasoning skills, teaching you to think critically about different approaches to a problem and their trade-offs.\n\n---\n\n### **The Synergy: How DSA Works Together**\n\nData Structures and Algorithms are inextricably linked. An algorithm *operates* on data, and the way that data is structured profoundly impacts the algorithm\'s efficiency and simplicity.\n\n*   **Example:** If you need to search for a specific word in a dictionary, using a **Binary Search Algorithm** on a **Sorted Array** (the dictionary pages) is incredibly fast. Trying to use it on an unsorted, unindexed collection of words would be impossible and inefficient. The choice of Data Structure directly enables or limits the efficiency of your Algorithm.\n\n---\n\n### **Navigating Your DSA Learning Journey**\n\n1.  **Start with the Basics:** Master arrays, linked lists, and fundamental sorting/searching algorithms before moving to more complex topics.\n2.  **Understand \"Why\":** Don\'t just memorize. Understand *why* a particular data structure or algorithm is used for certain problems and its advantages/disadvantages.\n3.  **Practice, Practice, Practice:** The best way to learn is by coding. Implement these structures and algorithms yourself. Solve problems on platforms like LeetCode, HackerRank, or your course assignments.\n4.  **Grasp Big O Notation:** This is essential for evaluating the efficiency of your solutions.\n5.  **Visualize:** Use online tools or draw diagrams to visualize how data structures change and how algorithms execute step-by-step.\n6.  **Don\'t Be Afraid to Struggle:** DSA can be challenging, but perseverance is key. Each concept you master builds confidence and strengthens your foundation.\n\n---\n\nLearning DSA is one of the most rewarding investments you can make in your computer science education. It equips you with a powerful mindset and toolset to tackle complex challenges and build incredible things.\n\nIf you have any more questions about specific data structures, algorithms, or need help with a particular concept, just ask! I\'m here to support your academic journey.', '2026-03-28 07:10:19'),
(17, 8, 'user', 'Hello!', '2026-04-30 17:09:01'),
(18, 8, 'bot', 'Hello there!\n\nI\'m Nexus AI, your academic assistant. How can I help you today? Do you have a question about a complex topic, need some study tips, or want to discuss something else related to your college studies?\n\nI\'m ready when you are!', '2026-04-30 17:09:01'),
(19, 8, 'user', 'can u display all the details about myself?', '2026-04-30 17:09:53'),
(20, 8, 'bot', 'That\'s an interesting question!\n\nAs **Nexus AI**, I actually don\'t store or have access to any personal details about you. My design prioritizes your privacy, and I don\'t retain information about individual users or past conversations once they\'re over.\n\nI\'m a language model, and my \"memory\" is limited to the immediate conversation we\'re having. I process your requests in real-time based on the input you provide, but I don\'t build a profile of who you are, your name, your past interactions, or any personal information you might have shared in previous (now concluded) sessions. This ensures that your interactions with me remain private and secure.\n\nSo, while I can\'t tell you about yourself, I\'m here to help you with academic questions, explain complex topics, offer study advice, and support your learning journey in any way I can!\n\nIs there something specific you\'d like to ask or discuss academically?', '2026-04-30 17:09:53'),
(21, 8, 'user', 'ok then tell me the details about the course Advanced Computer Networking', '2026-04-30 17:10:55'),
(22, 8, 'bot', 'Excellent choice! **Advanced Computer Networking** is a fascinating and crucial field, delving into the intricate mechanisms that power our connected world. As Nexus AI, I\'d be delighted to outline what a typical course in this area might cover.\n\n---\n\n### **Course Focus: Advanced Computer Networking**\n\nAn **Advanced Computer Networking** course typically builds upon foundational knowledge of computer networks (like those covered in an introductory \"Networking Fundamentals\" or \"Data Communications\" course). It aims to provide students with a deeper understanding of network architecture, protocols, design principles, and emerging technologies that enable modern, high-performance, and secure communication systems.\n\nThis course moves beyond the basics of how a network *works* to explore *why* networks are designed in certain ways, *how* to optimize their performance, *how* to secure them, and *what* cutting-edge technologies are shaping their future.\n\n#### **1. Core Objectives of the Course**\n\nStudents typically emerge from an Advanced Computer Networking course with the ability to:\n\n*   **Analyze complex network architectures:** Understand the design rationale behind large-scale networks (e.g., enterprise, data center, cloud, internet).\n*   **Evaluate network protocols:** Critically assess the performance, security, and efficiency of various network protocols.\n*   **Design and implement robust networks:** Apply advanced principles to design, configure, and troubleshoot sophisticated network systems.\n*   **Understand modern networking paradigms:** Grasp the concepts and implications of software-defined networking, virtualization, and cloud networking.\n*   **Address network security challenges:** Identify vulnerabilities and implement advanced security measures.\n*   **Engage with current research:** Appreciate the ongoing evolution and challenges in the field of computer networking.\n\n#### **2. Typical Key Topics and Modules**\n\nWhile specific curricula vary between institutions, an Advanced Computer Networking course commonly covers areas such as:\n\n*   **Advanced Routing Protocols:**\n    *   **Interior Gateway Protocols (IGPs):** Deep dive into OSPF (Open Shortest Path First) and EIGRP (Enhanced Interior Gateway Routing Protocol) beyond basic configuration.\n    *   **Exterior Gateway Protocols (EGPs):** In-depth study of BGP (Border Gateway Protocol), including path selection, peering, route policies, and Internet routing complexities.\n*   **Network Performance and Quality of Service (QoS):**\n    *   Traffic shaping, policing, queuing mechanisms (e.g., WFQ, CBWFQ, LLQ).\n    *   DiffServ (Differentiated Services) and IntServ (Integrated Services) architectures.\n    *   Congestion control mechanisms and optimization techniques.\n*   **Network Security at Advanced Levels:**\n    *   Firewall architectures (stateful, stateless, next-gen).\n    *   Intrusion Detection/Prevention Systems (IDS/IPS).\n    *   VPN technologies (IPsec, SSL/TLS VPNs).\n    *   Network access control (NAC) and authentication protocols (RADIUS, TACACS+).\n    *   DDoS attack mitigation strategies.\n*   **Software-Defined Networking (SDN) & Network Function Virtualization (NFV):**\n    *   Concepts of control plane and data plane separation.\n    *   OpenFlow protocol and SDN controllers (e.g., OpenDaylight, ONOS).\n    *   Virtualization of network devices (routers, firewalls) and services.\n    *   Cloud networking architectures.\n*   **Wireless and Mobile Networking (Advanced):**\n    *   Advanced Wi-Fi standards (e.g., Wi-Fi 6/802.11ax).\n    *   Cellular network architectures (e.g., 4G LTE, 5G NR).\n    *   Mobility management and handoff protocols.\n    *   Sensor networks and IoT connectivity.\n*   **Data Center Networking:**\n    *   Architectures (e.g., spine-leaf, fat-tree).\n    *   Protocols like TRILL, FabricPath, VXLAN.\n    *   Network virtualization within data centers.\n*   **Network Management and Monitoring:**\n    *   SNMP (Simple Network Management Protocol) in depth.\n    *   Network telemetry, logging, and analytics.\n    *   Network automation using scripting (e.g., Python) and configuration management tools (e.g., Ansible).\n\n#### **3. Prerequisites (Typical)**\n\nStudents are generally expected to have a strong foundation from:\n\n*   **Introduction to Computer Networks:** Covering OSI model, TCP/IP stack, Ethernet, IP addressing, basic routing (static, RIP, OSPF fundamentals), TCP/UDP, DNS, HTTP, etc.\n*   **Programming Skills:** Often Python or C++ for network programming, scripting, and understanding protocol implementations.\n*   **Data Structures and Algorithms:** For understanding efficiency and design of network protocols and software.\n*   **Operating Systems:** Basic understanding of how OS interacts with networking hardware and software.\n\n#### **4. Skills Developed**\n\nBeyond theoretical knowledge, this course fosters critical practical skills:\n\n*   **Network Design & Architecture:** Ability to conceptualize and plan complex network infrastructures.\n*   **Troubleshooting & Diagnostics:** Advanced skills in identifying and resolving network issues using tools like Wireshark, traceroute, ping, and logging systems.\n*   **Configuration & Implementation:** Hands-on experience with network devices (virtual or physical) and software.\n*   **Security Analysis:** Identifying and mitigating network vulnerabilities.\n*   **Scripting & Automation:** Automating network tasks and configurations.\n*   **Critical Thinking & Problem Solving:** Applying advanced concepts to real-world networking challenges.\n\n#### **5. Career Relevance**\n\nA strong grasp of advanced computer networking opens doors to many high-demand roles, including:\n\n*   **Network Architect / Engineer:** Designing and building complex networks.\n*   **Cybersecurity Analyst / Engineer:** Focusing on network security.\n*   **Cloud Network Engineer:** Managing network infrastructure in cloud environments.\n*   **DevNet Engineer:** Bridging development and networking for automation.\n*   **Data Center Engineer:** Specializing in high-performance data center networks.\n*   **Research & Development:** Contributing to the next generation of networking technologies.\n\n---\n\nThis course is often challenging but incredibly rewarding, as it provides the expertise to work with the foundational technology that underpins almost all modern digital services. It\'s an excellent pathway if you\'re passionate about the infrastructure that connects the world!\n\nDoes this overview help you visualize what an Advanced Computer Networking course entails?', '2026-04-30 17:10:55');

-- --------------------------------------------------------

--
-- Table structure for table `circulars`
--

CREATE TABLE `circulars` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `category` varchar(50) NOT NULL,
  `priority` enum('Normal','Urgent') DEFAULT 'Normal',
  `publisher` varchar(100) NOT NULL,
  `ref_id` varchar(50) DEFAULT NULL,
  `attachment_url` varchar(255) DEFAULT NULL,
  `published_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `circulars`
--

INSERT INTO `circulars` (`id`, `title`, `content`, `category`, `priority`, `publisher`, `ref_id`, `attachment_url`, `published_date`, `created_at`) VALUES
(1, 'End-of-Semester Examination Revised Schedule', 'The Office of the Controller of Examinations has released a revised schedule for the upcoming final assessments. All students are advised to re-verify their hall ticket allocations and reporting times immediately.', 'Exams', 'Urgent', 'Registrar\'s Office', 'AIA-2026-X91', '#', '2026-03-24', '2026-03-27 19:53:27'),
(2, 'Annual Cultural Fest: Call for Volunteers', 'Join the organizing committee for this year\'s \"AIA-Horizon 2026\". Applications are open for departmental leads and general student volunteers.', 'Events', 'Normal', 'Student Affairs', 'AIA-2026-E12', NULL, '2026-03-22', '2026-03-27 19:53:27'),
(3, 'Public Holiday: Foundation Day Observance', 'The campus will remain closed in honor of the University\'s Foundation Day. Classes will resume as per normal schedule the following day.', 'Holidays', 'Normal', 'HR Dept', 'AIA-2026-H05', NULL, '2026-03-19', '2026-03-27 19:53:27'),
(4, 'Thesis Submission Deadlines: Spring 2026', 'Final year post-graduate students are reminded that the portal for draft thesis submission closes on the 30th of this month. Late submissions will not be entertained.', 'Academics', 'Normal', 'Dean Academics', 'AIA-2026-A44', NULL, '2026-03-15', '2026-03-27 19:53:27'),
(5, 'Testing 1 ', 'This is to test the Circular page ', 'Administrative', 'Normal', 'Faculty Member', 'AIA-2026-AF0', NULL, '2026-04-28', '2026-04-28 11:48:40'),
(6, 'The Test 2 ', 'sdsdjksdkljsdjs', 'Academics', 'Normal', 'Faculty Member', 'AIA-2026-77J', '[\"uploads/circulars/circular-1777378044197-249.jpg\"]', '2026-04-28', '2026-04-28 12:07:24'),
(7, 'Photoshoot for Project Groups & Blessing Ceremony', 'The schedule is as follows:\r\n\r\n11:00 AM – 11:15 AM: Photoshoot for Project Groups 1 to 50\r\n11:15 AM: All students (Group ID 1 to 91) must assemble and be seated in Aryabhatta Hall, E Block, 5th Floor for the Blessing Ceremony (in the presence of top management)\r\n12:00 PM – 12:15 PM: Photoshoot for Project Groups 51 to 91, followed by continuation of Viva examination\r\n\r\nAs this is an important event, attendance is mandatory. Kindly be in proper formal attire (preferably white shirt and black trousers).\r\n\r\nEnjoy your last day in college and make it memorable.', 'Events', 'Normal', 'Faculty Member', 'AIA-2026-4LD', NULL, '2026-04-29', '2026-04-29 07:39:58');

-- --------------------------------------------------------

--
-- Table structure for table `colleges`
--

CREATE TABLE `colleges` (
  `id` int(11) NOT NULL,
  `college_name` varchar(150) NOT NULL,
  `college_code` varchar(50) NOT NULL,
  `university_name` varchar(150) DEFAULT NULL,
  `hod_email` varchar(100) DEFAULT NULL,
  `hod_phone` varchar(20) DEFAULT NULL,
  `clg_address` text DEFAULT NULL,
  `established_year` int(11) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `colleges`
--

INSERT INTO `colleges` (`id`, `college_name`, `college_code`, `university_name`, `hod_email`, `hod_phone`, `clg_address`, `established_year`, `status`, `created_at`) VALUES
(1, 'SILVER OAK COLLEGE OF COMPUTER APPLICATION', 'SOCCA', 'SILVER OAK UNIVERSITY', 'arjunsocca@sou.ac.in', '8989898989', 'Gota, Ahmedabad.', 2019, 'Active', '2026-02-12 09:27:52'),
(2, 'SILVER OAK COLLEGE OF INFORMATION TECHNOLOGY', 'SOCIT', 'SILVER OAK UNIVERSITY', 'manassocit@sou.ac.in', '9876543210', 'Gota, Ahmedabad', 2019, 'Active', '2026-02-22 10:53:43'),
(3, 'SILVER OAK COLLEGE OF ANIMATION & MULTIMEDIA', 'SOCAM', 'SILVER OAK UNIVERSITY', 'keyursocam@sou.ac.in', '1234567890', 'Gota, Ahmedabad', 2019, 'Active', '2026-03-27 18:50:35'),
(4, 'SILVER OAK INSTITUTE OF MANAGEMENT', 'SOIM', 'SILVER OAK UNIVERSITY', 'adminsoim@sou.ac.in', '7777777777', 'Gota, Ahmedabad', 2019, 'Active', '2026-04-13 09:25:50'),
(5, 'SILVER OAK LAW COLLEGE', 'SOLC', 'SILVER OAK UNIVERSITY', 'adminsolc@sou.ac.in', '2020202020', 'Gota, Ahmedabad', 2019, 'Active', '2026-04-25 09:21:28');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `course_id` int(11) NOT NULL,
  `course_code` varchar(20) NOT NULL,
  `course_name` varchar(100) NOT NULL,
  `department_id` int(11) DEFAULT NULL,
  `assigned_faculty_id` int(11) DEFAULT NULL,
  `course_coordinator_id` int(11) DEFAULT NULL,
  `credits` int(11) DEFAULT 3,
  `semester` int(11) NOT NULL,
  `course_type` enum('Core','Elective','Lab') DEFAULT 'Core',
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`course_id`, `course_code`, `course_name`, `department_id`, `assigned_faculty_id`, `course_coordinator_id`, `credits`, `semester`, `course_type`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'DS-101', 'Data Structures', 1, 1, 2, 3, 1, 'Core', 'A data structure is a way of organizing, storing, and managing data in a computer so that it can be accessed and modified efficiently.', 'active', '2026-02-04 09:44:50', '2026-04-23 17:02:54'),
(2, 'RDB-102', 'Relational Database Management System', 1, 8, 9, 5, 2, 'Elective', 'RDBMS (Relational Database Management System) is a database system that stores data in the form of tables (relations) with rows and columns, and maintains relationships between tables using primary and foreign keys.', 'active', '2026-02-04 10:01:16', '2026-04-21 11:43:37'),
(3, 'JA-103', 'Java Programming Language', 3, 7, 1, 8, 2, 'Lab', 'Java is a widely-used programming language that was created in 1995 and is owned by Oracle. It is known for its versatility and is used to develop a variety of applications, including mobile apps (especially Android apps), desktop applications, web applications, web servers, application servers, games, and database connections.', 'active', '2026-02-07 09:04:55', '2026-04-21 11:43:25'),
(4, 'PY-104', 'Python Programming Language', 1, 14, 8, 3, 1, 'Lab', 'Python is a versatile and easy-to-learn language that lets you work quickly and integrate systems more effectively.', 'active', '2026-02-22 11:05:15', '2026-04-27 20:09:22'),
(5, 'FD-105', 'FLUTTER DEVELOPMENT', 3, 2, 1, 7, 2, 'Lab', 'Flutter is an open-source framework by Google for building high-performance, cross-platform apps from a single codebase using the Dart programming language.', 'active', '2026-03-12 11:45:11', '2026-04-21 11:07:55'),
(6, 'CS-106', 'COMMUNICATION SKILLS', 3, 10, 11, 5, 1, 'Core', 'Communication skills are the abilities to convey and receive information effectively through verbal, nonverbal, written, and visual channels, essential for personal and professional success.', 'active', '2026-03-12 11:50:18', '2026-04-21 11:42:42'),
(7, 'ADE-107', 'ADOBE ILLUSTRATOR', 6, 2, 7, 3, 1, 'Lab', 'Adobe Illustrator CC is a multimedia application that remains the undisputed heavyweight champion for designers who need their work to look flawless, whether it is printed on a business card or wrapped around a skyscraper.', 'active', '2026-03-27 19:00:00', '2026-04-29 14:49:51'),
(9, 'MLM-108', 'Machine Learning Models', 5, 8, 2, 5, 1, 'Lab', 'Python, Pandas, and Neural Links.', 'active', '2026-04-21 11:47:27', '2026-04-21 11:47:27'),
(10, 'CN-109', 'ADVANCED COMPUTER NETWORKING', 5, 10, 14, 5, 1, 'Core', 'Computer networking is a system of interconnected computing devices that communicate and share resources with one another. It involves connecting two or more computing devices to enable the transmission and exchange of information and resources.', 'active', '2026-04-29 17:10:19', '2026-04-29 17:15:22');

-- --------------------------------------------------------

--
-- Table structure for table `course_discussions`
--

CREATE TABLE `course_discussions` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `student_name` varchar(100) NOT NULL,
  `text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_discussions`
--

INSERT INTO `course_discussions` (`id`, `course_id`, `student_id`, `student_name`, `text`, `created_at`) VALUES
(1, 3, 8, 'Arjun', 'This Lecture is Killing it ', '2026-03-13 17:19:14'),
(2, 3, 8, 'Arjun', 'OMAAAGAAA', '2026-03-13 17:46:36');

-- --------------------------------------------------------

--
-- Table structure for table `course_materials`
--

CREATE TABLE `course_materials` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `downloads` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_materials`
--

INSERT INTO `course_materials` (`id`, `course_id`, `file_name`, `file_url`, `uploaded_at`, `downloads`) VALUES
(1, 1, '_Final Project Presentation.pptx', 'uploads/materials/material-1773393497034-5205792.pptx', '2026-03-13 09:18:17', 4),
(2, 3, 'MCA-101_Analytics_Report.csv', 'uploads/materials/global-1773396145135-422230959.csv', '2026-03-13 10:02:25', 6),
(3, 3, 'Tag your yoru main agent in valorant XD#valorant #gaming.mp4', 'uploads/materials/global-1773396484534-689852821.mp4', '2026-03-13 10:08:04', 11),
(4, 5, 'students_table_structure.pdf', 'uploads/materials/global-1776747107146-538125059.pdf', '2026-04-21 04:51:47', 5),
(5, 5, 'hostel_db_structure.pdf', 'uploads/materials/global-1777549003954-441633310.pdf', '2026-04-30 11:36:43', 3);

-- --------------------------------------------------------

--
-- Table structure for table `exam_grades`
--

CREATE TABLE `exam_grades` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `exam_type` enum('Mid-Sem','Final-Sem','Oral','Practical') NOT NULL,
  `marks_obtained` decimal(5,2) NOT NULL,
  `total_marks` decimal(5,2) NOT NULL DEFAULT 100.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('draft','published') DEFAULT 'draft'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exam_grades`
--

INSERT INTO `exam_grades` (`id`, `student_id`, `course_id`, `exam_type`, `marks_obtained`, `total_marks`, `created_at`, `status`) VALUES
(1, 6, 1, 'Mid-Sem', 90.00, 150.00, '2026-03-03 06:36:45', 'draft'),
(3, 6, 7, 'Mid-Sem', 100.00, 100.00, '2026-03-05 07:23:01', 'draft'),
(7, 6, 3, 'Mid-Sem', 76.00, 100.00, '2026-03-06 15:50:23', 'published'),
(9, 6, 5, 'Mid-Sem', 85.00, 100.00, '2026-04-26 19:38:39', 'published'),
(10, 7, 5, 'Practical', 75.00, 100.00, '2026-04-27 06:18:11', 'published'),
(11, 8, 5, 'Mid-Sem', 85.00, 100.00, '2026-04-27 06:26:35', 'published'),
(12, 9, 5, 'Mid-Sem', 70.00, 100.00, '2026-04-27 06:30:38', 'published'),
(13, 18, 5, 'Mid-Sem', 50.00, 100.00, '2026-04-27 08:39:09', 'published'),
(14, 20, 5, 'Mid-Sem', 20.00, 100.00, '2026-04-27 08:39:21', 'published'),
(18, 8, 5, 'Practical', 80.00, 100.00, '2026-04-27 11:52:37', 'published'),
(20, 6, 5, 'Final-Sem', 85.00, 100.00, '2026-04-27 11:59:16', 'published'),
(24, 7, 5, 'Mid-Sem', 80.00, 100.00, '2026-04-27 12:12:09', 'published'),
(30, 8, 5, 'Final-Sem', 90.00, 100.00, '2026-04-27 18:15:29', 'published'),
(31, 9, 5, 'Final-Sem', 50.00, 100.00, '2026-04-27 18:15:37', 'published'),
(32, 9, 5, 'Practical', 34.00, 100.00, '2026-04-27 18:32:09', 'published'),
(33, 11, 1, 'Mid-Sem', 90.00, 100.00, '2026-04-27 19:50:41', 'published'),
(34, 8, 3, 'Mid-Sem', 90.00, 100.00, '2026-04-29 07:33:50', 'published'),
(35, 9, 3, 'Mid-Sem', 50.00, 100.00, '2026-04-29 07:33:55', 'published'),
(36, 8, 3, 'Final-Sem', 80.00, 100.00, '2026-04-29 07:34:05', 'published'),
(37, 9, 3, 'Final-Sem', 50.00, 100.00, '2026-04-29 07:34:09', 'published'),
(38, 8, 3, 'Practical', 90.00, 100.00, '2026-04-29 07:34:15', 'published'),
(39, 9, 3, 'Practical', 50.00, 100.00, '2026-04-29 07:34:21', 'published'),
(40, 6, 6, 'Mid-Sem', 90.00, 100.00, '2026-04-30 19:06:52', 'published'),
(41, 6, 10, 'Mid-Sem', 90.00, 100.00, '2026-04-30 19:08:10', 'published'),
(47, 6, 6, 'Final-Sem', 80.00, 100.00, '2026-04-30 19:09:41', 'published'),
(48, 6, 10, 'Final-Sem', 80.00, 100.00, '2026-04-30 19:09:41', 'published'),
(49, 6, 6, 'Practical', 80.00, 100.00, '2026-04-30 19:09:47', 'published'),
(50, 6, 10, 'Practical', 80.00, 100.00, '2026-04-30 19:09:47', 'published'),
(51, 7, 6, 'Mid-Sem', 90.00, 100.00, '2026-04-30 19:23:38', 'published'),
(53, 7, 6, 'Final-Sem', 95.00, 100.00, '2026-04-30 19:29:06', 'published'),
(55, 28, 6, 'Mid-Sem', 50.00, 100.00, '2026-04-30 19:39:33', 'published'),
(57, 28, 6, 'Final-Sem', 80.00, 100.00, '2026-04-30 21:12:22', 'published');

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

CREATE TABLE `faculty` (
  `faculty_id` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `city` text DEFAULT NULL,
  `state` text DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `branch_id` int(11) NOT NULL,
  `designation` varchar(100) NOT NULL,
  `qualification` varchar(100) NOT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `experience_years` int(11) DEFAULT 0,
  `resume_file` varchar(255) DEFAULT NULL,
  `joining_date` date NOT NULL,
  `status` enum('Active','On Leave','Left') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `faculty`
--

INSERT INTO `faculty` (`faculty_id`, `password`, `full_name`, `email`, `phone_number`, `gender`, `dob`, `city`, `state`, `profile_photo`, `branch_id`, `designation`, `qualification`, `specialization`, `experience_years`, `resume_file`, `joining_date`, `status`, `created_at`, `updated_at`) VALUES
(1, '$2b$10$Jnlpf4C7gvdkPTytu2eHGOmuCHEGOZfIRYAIMnhveAPVemaLwYQV2', 'Arjun', 'arjun@gmail.com', '1234567890', 'Male', '2003-10-20', 'Ahmedabad', 'Gujarat', '1770717995704.jpeg', 5, 'Lab Assistant', 'MCA', 'Graphics Designing', 5, '1776161120128.pdf', '2026-02-20', 'Active', '2026-02-07 11:04:17', '2026-04-14 10:05:20'),
(2, '$2b$10$v5oNWhJaxwKVK.JIvvCGL.kjpXouBrAQ4V1mGaJqtX6cTeKQAH5ne', 'Manas', 'mvvegad123@gmail.com', '1234567899', 'Male', '2003-02-08', 'Ahmedabad', 'Gujarat', '1770718009982.webp', 3, 'Lab Assistant', 'MCA', 'Flutter', 3, '1776160975142.pdf', '2026-02-20', 'Active', '2026-02-09 17:52:32', '2026-04-14 10:02:55'),
(4, '$2b$10$kwnx08y1Dp5Nuz.U1i0QK.ecAlY/KG1b40NS.R9sKIaIbyTm1f4ZS', 'Varun', 'varun@gmail.com', '1234567890', 'Male', '2004-01-04', 'Ahmedabad', 'Gujarat', '1770717959318.jpeg', 4, 'Assistant Lecturer', 'MCA', 'Mathematics', 3, '1770718756875.pdf', '2026-02-20', 'Active', '2026-02-09 18:45:45', '2026-03-13 09:41:43'),
(6, '$2b$10$DHSAzaZvzj9Go4sfq1BCp.xuw4402AzF2btnv22VPhpvvboGkxTX2', 'Suraj', 'suraj@gmail.com', '9876543210', 'Male', '2004-01-01', 'Ahmedabad', 'Gujarat', '1770716107026.webp', 2, 'Assistant Lecturer', 'MCA', 'Designing', 2, '1770716107029.pdf', '2026-02-20', 'Active', '2026-02-10 09:35:07', '2026-02-10 09:35:07'),
(7, '$2b$10$KBWLlUnQnUduha9i/YKey.AtP2/tU8XF3hJLJdpNNWMGqRRFiBwuK', 'Lakshya Parihar', 'lakshyaparihar36@gmail.com', '1234567890', 'Male', '2004-06-15', 'Ahmedabad', 'Gujarat', '1773311551325.png', 1, 'Assistant Lecturer', 'MCA', 'Web Development', 5, '1773311551358.pdf', '2025-10-10', 'Active', '2026-03-12 10:32:31', '2026-03-12 10:32:31'),
(8, '$2b$10$TM7KBStKg2fTWgI16ZDma.URm6Bgal6CTurfJAo58uHxwlVal49Ne', 'Keyur', 'keyur@gmail.com', '9876543210', 'Male', '2004-10-10', 'Ahmedabad', 'Gujarat', '1777106834887.jpeg', 6, 'Lab Assistant', 'MSC', 'Graphics Designing', 5, '1776160930065.pdf', '2026-03-30', 'Active', '2026-03-27 19:33:50', '2026-04-25 08:47:14'),
(9, '$2b$10$yhViFac1lNiFekE0YdOx1uSAAE59QsE5WbYz9BnvLdAeLqTHqahIe', 'Raj Mehta', 'raj@gmail.com', '9999999999', 'Male', '0000-00-00', 'Ahmedabad', 'Gujarat', 'raj.jpg', 7, 'Professor', 'MBA', 'AI', 5, 'raj.pdf', '0000-00-00', 'Active', '2026-04-14 09:59:58', '2026-04-14 09:59:58'),
(10, '$2b$10$oyTIYXzr6BMrpK6o8On3kuxArabMnREbhU14mLqDV1LOAyqoxIOl.', 'Alakh Pandey', 'alakh@gmail.com', '8888899999', 'Male', '0000-00-00', 'Ahmedabad', 'Gujarat', '1776160909693.jpg', 4, 'Professor', 'M.Tech', 'All', 5, '1776160909693.pdf', '0000-00-00', 'Active', '2026-04-14 09:59:58', '2026-04-14 10:01:49'),
(11, '$2b$10$kxMSnAHTpTgRzRryzHvx6O9EVSiW5r4MJsDTZbBIJxPi/9h5uqebK', 'Anuj Chauhan', 'anuj@gmail.com', '1234567890', 'Male', '2000-12-15', 'Ahmedabad', 'Gujarat', '1776161383406.jpg', 3, 'Lab Assistant', 'M.Tech', 'Mathematics', 3, '1776161422896.pdf', '2026-01-01', 'Active', '2026-04-14 10:09:43', '2026-04-14 10:10:22'),
(12, '$2b$10$Kcad5DfasFEvpC..at3gq.aJxySYn2x144BlLlHE7Jm0xA8EDNaKe', 'Alok Sharma', 'alok@gmail.com', '9999999999', 'Male', '0000-00-00', 'Ahmedabad', 'Gujarat', 'alok.jpg', 7, 'Professor', 'MBA', 'AI', 2, 'alok.pdf', '0000-00-00', 'Active', '2026-04-22 11:49:12', '2026-04-22 11:49:12'),
(13, '$2b$10$gkjQesl327iwTaIKcLiyI.HfPjDbwC9DDI6gqc9iaeEF7V24m12jO', 'Dipali Sharma', 'dipali@gmail.com', '8888899999', 'Female', '0000-00-00', 'Ahmedabad', 'Gujarat', 'dipali.jpg', 4, 'Professor', 'M.Tech', 'AI', 3, 'dipali.pdf', '0000-00-00', 'Active', '2026-04-22 11:49:12', '2026-04-22 11:49:12'),
(14, '$2b$10$f0uslo9dSKjyexVmMbCNv./kNrPsXTQUSuTap7T9Mp9C9Qfhe3Avu', 'Mandeep Singh', 'mandeep@gmail.com', '1010101010', 'Male', '2000-10-10', 'Ahmedabad', 'Gujarat', '1776975111804.jpeg', 5, 'Lab Assistant', 'M.Tech', 'Web Development', 4, '1776975111816.pdf', '2026-02-03', 'Active', '2026-04-23 20:11:52', '2026-04-23 20:16:23');

-- --------------------------------------------------------

--
-- Table structure for table `fee_transactions`
--

CREATE TABLE `fee_transactions` (
  `id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `semester_fee_id` int(11) DEFAULT NULL,
  `amount_paid` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fee_transactions`
--

INSERT INTO `fee_transactions` (`id`, `student_id`, `semester`, `semester_fee_id`, `amount_paid`, `payment_method`, `transaction_id`, `payment_date`) VALUES
(6, 10, 1, 26, 20000.00, 'Online', 'AMS745477', '2026-03-03 11:35:01'),
(7, 10, 1, 26, 15000.00, 'Online', 'AMS494951', '2026-03-03 11:49:19'),
(8, 10, 1, 26, 2500.00, 'Online', 'AMS619007', '2026-03-03 12:27:20'),
(9, 6, 1, 34, 20000.00, 'Online', 'AMS555939', '2026-03-03 12:42:32'),
(10, 10, 2, 27, 37500.00, 'Online', 'AMS483350', '2026-03-03 12:53:41'),
(11, 10, 3, 28, 37500.00, 'Online', 'AMS389089', '2026-03-03 12:53:47'),
(12, 8, 1, 38, 30000.00, 'Online', 'AMS359943', '2026-03-03 12:56:30'),
(13, 8, 1, 38, 30000.00, 'Online', 'AMS769086', '2026-03-03 12:56:35'),
(14, 9, 1, 42, 50000.00, 'Online', 'AMS716347', '2026-03-03 13:00:17'),
(15, 9, 1, 42, 10000.00, 'Online', 'AMS901699', '2026-03-03 13:00:21'),
(16, 7, 1, 46, 10000.00, 'Online', 'AMS920940', '2026-03-03 14:32:44'),
(17, 11, 1, 58, 20000.00, 'Online', 'AMS303928', '2026-03-12 12:14:26'),
(18, 8, 2, 39, 30000.00, 'Online', 'AMS374275', '2026-05-01 17:00:10');

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `faculty_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `time_limit` int(11) DEFAULT 60,
  `status` enum('DRAFT','PUBLISHED') DEFAULT 'DRAFT',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`id`, `course_id`, `faculty_id`, `title`, `description`, `time_limit`, `status`, `created_at`) VALUES
(1, 1, 1, 'Data Structures Mid-Term', 'Covers basic array and linked list operations.', 45, 'PUBLISHED', '2026-04-14 08:42:07'),
(2, 3, 1, 'Java OOP Basics', 'Inheritance, Polymorphism, and Encapsulation.', 30, 'DRAFT', '2026-04-14 08:42:07'),
(3, 1, 1, 'Quizz 1 Champter 1 ', 'write and read thoroughly ', 60, 'PUBLISHED', '2026-04-14 09:38:41'),
(4, 3, 7, 'Chapter-1 Introduction to Java Programming', 'Covers Basic introduction part of Java.', 10, 'PUBLISHED', '2026-04-29 07:51:52'),
(5, 5, 2, 'Chapter-1 Flutter Introduction', 'Covers Basic introduction part of Flutter Development.', 20, 'PUBLISHED', '2026-04-29 14:04:01'),
(6, 6, 10, 'CH-1 Introduction to Communication Skills', 'introduction to communication skills', 25, 'PUBLISHED', '2026-04-30 19:05:11');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questions`
--

CREATE TABLE `quiz_questions` (
  `id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `points` int(11) DEFAULT 5,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`options`)),
  `correct_option_id` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_questions`
--

INSERT INTO `quiz_questions` (`id`, `quiz_id`, `question_text`, `points`, `options`, `correct_option_id`) VALUES
(1, 1, 'What is the time complexity of accessing an element in an array by index?', 5, '[{\"id\":\"A\",\"text\":\"O(1)\",\"isCorrect\":true},{\"id\":\"B\",\"text\":\"O(n)\",\"isCorrect\":false},{\"id\":\"C\",\"text\":\"O(log n)\",\"isCorrect\":false},{\"id\":\"D\",\"text\":\"O(n^2)\",\"isCorrect\":false}]', 'A'),
(2, 1, 'Which data structure follows the Last-In-First-Out (LIFO) principle?', 5, '[{\"id\":\"A\",\"text\":\"Queue\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"Stack\",\"isCorrect\":true},{\"id\":\"C\",\"text\":\"Tree\",\"isCorrect\":false},{\"id\":\"D\",\"text\":\"Graph\",\"isCorrect\":false}]', 'B'),
(3, 2, 'Which keyword is used to inherit a class in Java?', 5, '[{\"id\":\"A\",\"text\":\"implements\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"inherits\",\"isCorrect\":false},{\"id\":\"C\",\"text\":\"extends\",\"isCorrect\":true},{\"id\":\"D\",\"text\":\"super\",\"isCorrect\":false}]', 'C'),
(4, 3, 'Full-Form Of DBMS', 5, '[{\"id\":\"A\",\"text\":\"Database Management System\",\"isCorrect\":true},{\"id\":\"B\",\"text\":\"sfafsfa\",\"isCorrect\":false},{\"id\":\"C\",\"text\":\"shjfioshfois\",\"isCorrect\":false},{\"id\":\"D\",\"text\":\"asfsfasfas\",\"isCorrect\":false}]', 'A'),
(5, 4, 'What is the size of an int variable in Java?', 5, '[{\"id\":\"A\",\"text\":\"8 bits\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"16 bits\",\"isCorrect\":false},{\"id\":\"C\",\"text\":\"32 bits\",\"isCorrect\":true},{\"id\":\"D\",\"text\":\"64 bits\",\"isCorrect\":false}]', 'C'),
(6, 4, 'Which method is the entry point for any standard Java program?', 5, '[{\"id\":\"A\",\"text\":\"start()\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"main()\",\"isCorrect\":true},{\"id\":\"C\",\"text\":\"run()\",\"isCorrect\":false},{\"id\":\"D\",\"text\":\"init()\",\"isCorrect\":false}]', 'B'),
(7, 4, 'Which keyword is used to inherit a class in Java?', 5, '[{\"id\":\"A\",\"text\":\"implements\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"inherits\",\"isCorrect\":false},{\"id\":\"C\",\"text\":\"extends\",\"isCorrect\":true},{\"id\":\"D\",\"text\":\"super\",\"isCorrect\":false}]', 'C'),
(8, 4, 'What is the default value of a boolean instance variable?', 5, '[{\"id\":\"A\",\"text\":\"true\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"false\",\"isCorrect\":true},{\"id\":\"C\",\"text\":\"null\",\"isCorrect\":false},{\"id\":\"D\",\"text\":\"0\",\"isCorrect\":false}]', 'B'),
(9, 4, 'Which package contains the Random class?', 5, '[{\"id\":\"A\",\"text\":\"java.util\",\"isCorrect\":true},{\"id\":\"B\",\"text\":\"java.lang\",\"isCorrect\":false},{\"id\":\"C\",\"text\":\"java.io\",\"isCorrect\":false},{\"id\":\"D\",\"text\":\"java.math\",\"isCorrect\":false}]', 'A'),
(10, 5, 'What language is used to write Flutter applications?', 5, '[{\"id\":\"A\",\"text\":\"Java\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"Kotlin\",\"isCorrect\":false},{\"id\":\"C\",\"text\":\"Dart\",\"isCorrect\":true},{\"id\":\"D\",\"text\":\"Swift\",\"isCorrect\":false}]', 'C'),
(11, 5, 'Which widget is used to create a UI that does not change dynamically?', 5, '[{\"id\":\"A\",\"text\":\"StatefulWidget\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"StatelessWidget\",\"isCorrect\":true},{\"id\":\"C\",\"text\":\"InheritedWidget\",\"isCorrect\":false},{\"id\":\"D\",\"text\":\"ReactiveWidget\",\"isCorrect\":false}]', 'B'),
(12, 5, 'What command is used to create a new Flutter project from the terminal?', 5, '[{\"id\":\"A\",\"text\":\"flutter init\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"flutter build\",\"isCorrect\":false},{\"id\":\"C\",\"text\":\"flutter create\",\"isCorrect\":true},{\"id\":\"D\",\"text\":\"flutter start\",\"isCorrect\":false}]', 'C'),
(13, 5, 'Which function acts as the entry point of a Flutter application?', 5, '[{\"id\":\"A\",\"text\":\"runApp()\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"main()\",\"isCorrect\":true},{\"id\":\"C\",\"text\":\"build()\",\"isCorrect\":false},{\"id\":\"D\",\"text\":\"initState()\",\"isCorrect\":false}]', 'B'),
(14, 5, 'Which file is used to manage dependencies and assets in a Flutter project?', 5, '[{\"id\":\"A\",\"text\":\"package.json\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"build.gradle\",\"isCorrect\":false},{\"id\":\"C\",\"text\":\"pubspec.yaml\",\"isCorrect\":true},{\"id\":\"D\",\"text\":\"manifest.xml\",\"isCorrect\":false}]', 'C'),
(15, 6, 'What is the primary purpose of active listening?', 5, '[{\"id\":\"A\",\"text\":\"To formulate a quick response\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"To understand the speaker\'s complete message\",\"isCorrect\":true},{\"id\":\"C\",\"text\":\"To dominate the conversation\",\"isCorrect\":false},{\"id\":\"D\",\"text\":\"To point out the speaker\'s mistakes\",\"isCorrect\":false}]', 'B'),
(16, 6, 'Which of the following is considered a form of non-verbal communication?', 5, '[{\"id\":\"A\",\"text\":\"Writing an email\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"Delivering a speech\",\"isCorrect\":false},{\"id\":\"C\",\"text\":\"Maintaining eye contact\",\"isCorrect\":true},{\"id\":\"D\",\"text\":\"Conducting a podcast\",\"isCorrect\":false}]', 'C'),
(17, 6, 'What does the \"KISS\" principle stand for in communication?', 5, '[{\"id\":\"A\",\"text\":\"Keep It Short and Simple\",\"isCorrect\":true},{\"id\":\"B\",\"text\":\"Keep Informing Students Swiftly\",\"isCorrect\":false},{\"id\":\"C\",\"text\":\"Know Important Speaking Strategies\",\"isCorrect\":false},{\"id\":\"D\",\"text\":\"Keep Interacting with Supervisors\",\"isCorrect\":false}]', 'A'),
(18, 6, 'Which barrier to communication involves misinterpreting the meaning of words?', 5, '[{\"id\":\"A\",\"text\":\"Physical barrier\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"Semantic barrier\",\"isCorrect\":true},{\"id\":\"C\",\"text\":\"Psychological barrier\",\"isCorrect\":false},{\"id\":\"D\",\"text\":\"Organizational barrier\",\"isCorrect\":false}]', 'B'),
(19, 6, 'What is the standard term for the person who initiates a message in the communication process?', 5, '[{\"id\":\"A\",\"text\":\"Receiver\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"Decoder\",\"isCorrect\":false},{\"id\":\"C\",\"text\":\"Channel\",\"isCorrect\":false},{\"id\":\"D\",\"text\":\"Sender\",\"isCorrect\":true}]', 'D'),
(20, 6, 'Which of the following is an example of formal communication in an organization?', 5, '[{\"id\":\"A\",\"text\":\"Water cooler chats\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"An official company memo\",\"isCorrect\":true},{\"id\":\"C\",\"text\":\"Gossiping with a coworker\",\"isCorrect\":false},{\"id\":\"D\",\"text\":\"Texting a peer about lunch\",\"isCorrect\":false}]', 'B'),
(21, 6, 'What type of communication flows from subordinates to management?', 5, '[{\"id\":\"A\",\"text\":\"Downward communication\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"Lateral communication\",\"isCorrect\":false},{\"id\":\"C\",\"text\":\"Upward communication\",\"isCorrect\":true},{\"id\":\"D\",\"text\":\"Diagonal communication\",\"isCorrect\":false}]', 'C'),
(22, 6, 'What is \"feedback\" in the communication loop?', 5, '[{\"id\":\"A\",\"text\":\"The medium used to send the message\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"The receiver\'s response to the sender\'s message\",\"isCorrect\":true},{\"id\":\"C\",\"text\":\"The interference that distorts the message\",\"isCorrect\":false},{\"id\":\"D\",\"text\":\"The initial idea formed by the sender\",\"isCorrect\":false}]', 'B'),
(23, 6, 'Which of the following best describes \"empathy\" in communication?', 5, '[{\"id\":\"A\",\"text\":\"Feeling pity for the other person\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"Agreeing with everything the speaker says\",\"isCorrect\":false},{\"id\":\"C\",\"text\":\"Understanding and sharing the feelings of another\",\"isCorrect\":true},{\"id\":\"D\",\"text\":\"Ignoring the emotional state of the speaker\",\"isCorrect\":false}]', 'C'),
(24, 6, 'When writing a professional email, what is the best practice for the subject line?', 5, '[{\"id\":\"A\",\"text\":\"Leave it blank to create suspense\",\"isCorrect\":false},{\"id\":\"B\",\"text\":\"Write a long, detailed paragraph\",\"isCorrect\":false},{\"id\":\"C\",\"text\":\"Use a clear, concise summary of the email\'s purpose\",\"isCorrect\":true},{\"id\":\"D\",\"text\":\"Just write \\\"Urgent\\\" for every email\",\"isCorrect\":false}]', 'C');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_results`
--

CREATE TABLE `quiz_results` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `total_points` int(11) NOT NULL,
  `completed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_results`
--

INSERT INTO `quiz_results` (`id`, `student_id`, `quiz_id`, `score`, `total_points`, `completed_at`) VALUES
(1, 8, 1, 5, 10, '2026-04-18 07:56:57'),
(2, 8, 3, 5, 5, '2026-04-18 07:57:09'),
(3, 11, 1, 5, 10, '2026-04-23 17:04:54'),
(4, 11, 3, 5, 5, '2026-04-27 19:52:23'),
(5, 8, 4, 15, 25, '2026-04-29 13:38:31'),
(6, 8, 5, 20, 25, '2026-04-29 14:05:50');

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL,
  `faculty_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `start_time` varchar(20) NOT NULL,
  `end_time` varchar(20) NOT NULL,
  `class_type` varchar(50) DEFAULT 'Lecture',
  `course_name` varchar(255) NOT NULL,
  `course_code` varchar(50) NOT NULL,
  `semester` int(11) DEFAULT 1,
  `room_no` varchar(100) DEFAULT 'TBD',
  `student_count` int(11) DEFAULT 0,
  `status` varchar(50) DEFAULT 'Upcoming',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` (`id`, `faculty_id`, `course_id`, `date`, `start_time`, `end_time`, `class_type`, `course_name`, `course_code`, `semester`, `room_no`, `student_count`, `status`, `created_at`) VALUES
(124, 1, 1, '2026-03-23', '07:30', '08:20', 'Lecture', 'Data Structures', 'MCA-101', 1, 'Block A-101', 60, 'Upcoming', '2026-03-25 16:51:11'),
(125, 1, 2, '2026-03-23', '08:25', '09:15', 'Lecture', 'Relational Database Management System', 'MCA-102', 1, 'Block A-101', 60, 'Upcoming', '2026-03-25 16:51:11'),
(126, 1, 7, '2026-03-23', '09:30', '10:20', 'Lecture', 'Advanced Database Systems', 'MCA-201', 2, 'Block B-201', 55, 'Upcoming', '2026-03-25 16:51:11'),
(127, 1, 8, '2026-03-23', '10:25', '11:15', 'Lecture', 'Machine Learning Models', 'MCA-202', 2, 'Block B-201', 55, 'Upcoming', '2026-03-25 16:51:11'),
(128, 1, 3, '2026-03-23', '11:30', '12:20', 'Lab', 'Java Programming Language', 'MCA-103', 1, 'Lab 1', 30, 'Upcoming', '2026-03-25 16:51:11'),
(129, 1, 4, '2026-03-24', '07:30', '08:25', 'Lab', 'Python Programming Language', 'MCA-104', 1, 'Lab 2', 30, 'Upcoming', '2026-03-25 16:51:11'),
(130, 1, 1, '2026-03-24', '08:30', '09:25', 'Lecture', 'Data Structures', 'MCA-101', 1, 'Block A-101', 60, 'Upcoming', '2026-03-25 16:51:11'),
(131, 1, 2, '2026-03-24', '09:40', '10:35', 'Lecture', 'Relational Database Management System', 'MCA-102', 1, 'Block A-101', 60, 'Upcoming', '2026-03-25 16:51:11'),
(132, 1, 7, '2026-03-24', '10:40', '11:35', 'Lecture', 'Advanced Database Systems', 'MCA-201', 2, 'Block B-201', 55, 'Upcoming', '2026-03-25 16:51:11'),
(133, 1, 8, '2026-03-25', '07:30', '08:15', 'Lecture', 'Machine Learning Models', 'MCA-202', 2, 'Block B-201', 55, 'Upcoming', '2026-03-25 16:51:11'),
(134, 1, 3, '2026-03-25', '08:20', '09:05', 'Lab', 'Java Programming Language', 'MCA-103', 1, 'Lab 1', 30, 'Upcoming', '2026-03-25 16:51:11'),
(135, 1, 4, '2026-03-25', '09:20', '10:05', 'Lab', 'Python Programming Language', 'MCA-104', 1, 'Lab 2', 30, 'Upcoming', '2026-03-25 16:51:11'),
(136, 1, 1, '2026-03-25', '10:10', '10:55', 'Lecture', 'Data Structures', 'MCA-101', 1, 'Block A-101', 60, 'Upcoming', '2026-03-25 16:51:11'),
(137, 1, 2, '2026-03-25', '11:00', '11:45', 'Lecture', 'Relational Database Management System', 'MCA-102', 1, 'Block A-101', 60, 'Upcoming', '2026-03-25 16:51:11'),
(138, 1, 7, '2026-03-26', '07:30', '08:20', 'Lecture', 'Advanced Database Systems', 'MCA-201', 2, 'Block B-201', 55, 'Upcoming', '2026-03-25 16:51:11'),
(139, 1, 8, '2026-03-26', '08:25', '09:15', 'Lecture', 'Machine Learning Models', 'MCA-202', 2, 'Block B-201', 55, 'Upcoming', '2026-03-25 16:51:11'),
(140, 1, 3, '2026-03-26', '09:30', '10:20', 'Lab', 'Java Programming Language', 'MCA-103', 1, 'Lab 1', 30, 'Upcoming', '2026-03-25 16:51:11'),
(141, 1, 4, '2026-03-26', '10:25', '11:15', 'Lab', 'Python Programming Language', 'MCA-104', 1, 'Lab 2', 30, 'Upcoming', '2026-03-25 16:51:11'),
(142, 1, 1, '2026-03-27', '07:30', '08:15', 'Lecture', 'Data Structures', 'MCA-101', 1, 'Block A-101', 60, 'Upcoming', '2026-03-25 16:51:11'),
(143, 1, 2, '2026-03-27', '08:20', '09:05', 'Lecture', 'Relational Database Management System', 'MCA-102', 1, 'Block A-101', 60, 'Upcoming', '2026-03-25 16:51:11'),
(144, 1, 7, '2026-03-27', '09:20', '10:05', 'Lecture', 'Advanced Database Systems', 'MCA-201', 2, 'Block B-201', 55, 'Upcoming', '2026-03-25 16:51:11'),
(145, 1, 8, '2026-03-27', '10:10', '10:55', 'Lecture', 'Machine Learning Models', 'MCA-202', 2, 'Block B-201', 55, 'Upcoming', '2026-03-25 16:51:11'),
(146, 1, 3, '2026-03-27', '11:00', '11:45', 'Lab', 'Java Programming Language', 'MCA-103', 1, 'Lab 1', 30, 'Upcoming', '2026-03-25 16:51:11'),
(147, 1, 3, '2026-04-01', '22:26', '23:27', 'Lecture', 'Java Programming Language', 'MCA-103', 1, 'Block 19', 120, 'Upcoming', '2026-03-25 16:56:27'),
(148, 1, 1, '2026-04-26', '08:00', '09:00', 'Lecture', 'Data Structures', 'DS-101', 1, 'B-102', 60, 'Upcoming', '2026-04-25 19:03:18');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `enrollment_no` varchar(30) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_first_login` tinyint(1) DEFAULT 1,
  `status` enum('active','inactive') DEFAULT 'active',
  `college_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT 'Male',
  `dob` date DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `father_occupation` varchar(100) DEFAULT NULL,
  `mother_name` varchar(100) DEFAULT NULL,
  `mother_occupation` varchar(100) DEFAULT NULL,
  `tenth_percent` decimal(5,2) DEFAULT NULL,
  `twelfth_percent` decimal(5,2) DEFAULT NULL,
  `aadhar_file` varchar(255) DEFAULT NULL,
  `leaving_file` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `enrollment_no`, `name`, `email`, `phone`, `semester`, `password`, `is_first_login`, `status`, `college_id`, `branch_id`, `gender`, `dob`, `photo`, `state`, `city`, `pincode`, `father_name`, `father_occupation`, `mother_name`, `mother_occupation`, `tenth_percent`, `twelfth_percent`, `aadhar_file`, `leaving_file`, `created_at`) VALUES
(6, '016', 'Mr. Sparrow', 'mvvegad123@gmail.com', '78743 27131', 1, '$2b$10$WmM8O3dVUHK3BM6obsSEF.0adyAwvyqrdwEeC5jF5DHtkMPCxivSa', 0, 'active', 1, 3, 'Male', '2003-02-09', '1769023614122.webp', 'Gujarat', 'Junagadh', '362001', 'Private', 'Bank Manager', 'Private', 'Housewife', 80.00, 80.00, '1769023614216.png', '1769023614304.png', '2026-01-21 19:26:54'),
(7, '029', 'Keyur Sir', 'keyur@gmail.com', '9999999999', 1, '$2b$10$VvmlFSXWfMvF3Po5HT35UOXnOVN7Ck7jRMLicZw6nYCHC.Q1akia6', 0, 'active', 1, 3, 'Male', '2003-06-03', '1769275546675.png', 'Gujarat', 'Ahmedabad', '3622424', 'Private', 'Carpenter', 'Private', 'Housewife', 99.00, 99.00, '1769275547571.png', '1769275547740.png', '2026-01-24 17:25:48'),
(8, '042', 'Arjun', 'arjun@gmail.com', '8999999998', 2, '$2b$10$aVaA3sCyAW5tvrHI.GS9WO4RAss0CcsETVNde.CtWHOHV784mfT0i', 0, 'active', 1, 3, 'Male', '2003-09-20', '1769283401306.png', 'Gujarat', 'Ahmedabad', '3622424', 'Maheshbhai', 'Mechanical Engineer', 'Private', 'Housewife', 90.00, 90.00, '1769283402373.png', '1769283402639.png', '2026-01-24 19:36:44'),
(9, '021', 'Suraj', 'suraj@gmail.com', '1234567890', 2, '$2b$10$OQeociqowkgTAoQGAgFSj.uhktlz38sY4/.XfznDGCvLHbKPf5/Wq', 0, 'active', 1, 3, 'Male', '2004-07-12', '1770452808175.svg', 'Gujarat', 'Ahmedabad', '3622424', 'Jayprakash', 'Carpenter', 'Private', 'Housewife', 90.00, 90.00, '1770191726862.png', '1770191726864.png', '2026-02-04 07:55:26'),
(10, '055', 'Varun Jadav', 'varun@gmail.com', '1234567890', 4, '$2b$10$1e3byvE.x5EOH6f12bIsJuRKI0gxefMFDadSts4o80FAEua0MPHO.', 0, 'active', 2, 4, 'Male', '2002-01-01', '1771789281322.jpeg', 'Gujarat', 'Ahmedabad', '382424', 'Mr. Jadav', 'Private', 'Mrs. Jadav', 'Private', 90.00, 90.00, '1771789281371.pdf', '1771789281436.pdf', '2026-02-22 19:41:21'),
(11, '282', 'Hemal Vaishnav', 'hemal@gmail.com', '1234567890', 1, '$2b$10$pQr4u/GQuK1rSgIhV27sPOdjtJ4gu1zGgqlj9e/8/UPPK.ZQ/dKci', 0, 'active', 2, 1, 'Male', '2003-12-13', '1773313130041.jpeg', 'Gujarat', 'Ahmedabad', '382424', 'Private', 'Railway', 'Private', 'HouseWife', 99.00, 99.00, '1773313130060.pdf', '1773313130076.pdf', '2026-03-12 10:58:50'),
(12, '030', 'Rahul Sharma', 'rahul@gmail.com', '9876543210', 1, '$2b$10$0mHJrGQQhREuJ2CQzw.hAeHZvc2o.NiTo/rvO4/T4INzzC57VYA9q', 0, 'active', 3, 6, 'Male', '2003-12-15', '1774638152775.webp', 'Gujarat', 'Ahmedabad', '382424', 'Private', 'Businessman', 'Private', 'Housewife', 80.00, 85.00, '1774638152788.pdf', '1774638152797.pdf', '2026-03-27 19:02:32'),
(13, '300', 'Mayank Sharma', 'mayank@gmail.com', '9999999999', 1, '$2b$10$OAU9Sdxh3qa7Lvh.JvMMSeGqfzoSvVQG3Y67pwromATpPQcgm6cgC', 1, 'active', 3, 6, 'Male', '0000-00-00', '300.jpg', 'Gujarat', 'Ahmedabad', '380001', 'Rajesh', 'Engineer', 'Sita', 'Teacher', 85.00, 82.00, '300.pdf', '300.pdf', '2026-04-13 10:06:54'),
(14, '301', 'Vikas Jain', 'vikas@gmail.com', '8888888888', 1, '$2b$10$sBGiozyAeyUzuVXKIXmN6O07AFB0EDR.jwed2phB7jyoR5yT7Jaby', 1, 'active', 3, 6, 'Male', '0000-00-00', '301.jpg', 'Gujarat', 'Surat', '395001', 'Ramesh', 'Business', 'Geeta', 'Doctor', 90.00, 88.00, '301.pdf', '301.pdf', '2026-04-13 10:06:54'),
(15, '302', 'Bhavya Solanki', 'bhavya@gmail.com', '7777777777', 1, '$2b$10$hS.cJnPgOgjFd5LPNJoSd.C1jDD5lrZDXd.Mh8Fu7DFxqzAhCRUgS', 1, 'active', 2, 2, 'Female', '0000-00-00', '302.jpg', 'Gujarat', 'Surat', '395001', 'Mukesh', 'Carpenter', 'Reena', 'Housewife', 85.00, 90.00, '302.pdf', '302.pdf', '2026-04-13 10:06:54'),
(16, '303', 'Suresh Rajput', 'suresh@gmail.com', '6666666666', 1, '$2b$10$ElYIMxFlznMl2LqzUChjHODhYSuN/d4EnOUQFxQoFy9E02L9/e80C', 1, 'active', 4, 7, 'Male', '0000-00-00', '303.jpg', 'Gujarat', 'Ahmedabad', '380001', 'Mahesh', 'Business', 'Neha', 'Teacher', 88.00, 85.00, '303.pdf', '303.pdf', '2026-04-13 10:06:55'),
(17, '304', 'Rahul Prajapati', 'rahul@gmail.com', '5555555555', 1, '$2b$10$wD2hOOS1I1A7M.MFInS2.uI26Q0.T2LyvT73Sn7sBgvWAg7pS5m7i', 1, 'active', 4, 7, 'Male', '0000-00-00', '304.jpg', 'Gujarat', 'Surat', '395001', 'Suresh', 'Engineer', 'Arya', 'Fashion Designer', 75.00, 80.00, '304.pdf', '304.pdf', '2026-04-13 10:06:55'),
(18, '305', 'Arun Verma', 'arun@gmail.com', '9999999999', 1, '$2b$10$XyX8siT3FyzVpM9JhxDxoeEarjGNhdH9EfrmHANt8CwTN1LnELT26', 1, 'active', 1, 3, 'Male', '0000-00-00', '305.jpg', 'Gujarat', 'Ahmedabad', '380001', 'Nilesh', 'Engineer', 'Rinku', 'Teacher', 85.00, 82.00, '305.pdf', '305.pdf', '2026-04-13 11:10:15'),
(19, '306', 'Nehal Singh', 'nehal@gmail.com', '8888888888', 1, '$2b$10$Ca/ryG7B0zgrZ1osxcCHju2mH4JF3sTlcCl..vYXOrMzSuFsIhDfa', 0, 'active', 3, 6, 'Male', '0000-00-00', '306.jpg', 'Gujarat', 'Surat', '395001', 'Aryan', 'Business', 'Payal', 'Doctor', 90.00, 88.00, '306.pdf', '306.pdf', '2026-04-13 11:10:15'),
(20, '307', 'Soham Sharma', 'soham@gmail.com', '9999999999', 1, '$2b$10$eQt1FOcvSLbRJVO0VX04I.qISkPy8KYrEEeyCAq32RbXhDC.ZTYaW', 1, 'active', 1, 3, 'Male', '0000-00-00', '307.jpg', 'Gujarat', 'Ahmedabad', '380001', 'Garg', 'Engineer', 'Reena', 'Teacher', 85.00, 82.00, '307.pdf', '307.pdf', '2026-04-14 07:55:39'),
(21, '308', 'Ayush Saxena', 'ayush@gmail.com', '8888888888', 1, '$2b$10$NPjbVYuaDbXNswgKN.QDFuYFGdMulJ7psSTj27KDGgYG/G6hRiSsK', 0, 'active', 3, 6, 'Male', '0000-00-00', '308.jpg', 'Gujarat', 'Surat', '395001', 'Ahan', 'Business', 'Meena', 'Doctor', 90.00, 88.00, '308.pdf', '308.pdf', '2026-04-14 07:55:39'),
(22, '309', 'Prince Chauhan', 'prince@gmail.com', '9876543210', 1, '$2b$10$NiEDr14u2AOi4.L6jKf.r.KETLoCiDOCjy4DZaz5XrMRNfHi0abHS', 1, 'active', 1, 5, 'Male', '2004-10-11', '1776154628854.jpg', 'Gujarat', 'Ahmedabad', '382424', 'Ramesh', 'Businessman', 'Rekha', 'Housewife', 75.00, 75.00, '1776154628889.pdf', '1776154628901.pdf', '2026-04-14 08:17:09'),
(23, '310', 'Aarav Patel', 'aarav.p@gmail.com', '9876543210', 1, '$2b$10$yshjLcXhQklpUDxTgG/L/uRoONfLTpzrWoao.bpwUwlHJYyOqI3NG', 1, 'active', 2, 4, 'Male', '0000-00-00', '310.jpg', 'Gujarat', 'Ahmedabad', '380009', 'Rajesh Patel', 'Business', 'Meena Patel', 'Homemaker', 88.50, 85.00, '310.pdf', '310.pdf', '2026-04-22 11:03:56'),
(24, '311', 'Priya Sharma', 'priya.s@gmail.com', '9876543211', 1, '$2b$10$PmGvQZDlXNIXlCZJB7w8Ou8vepezUurKynNb6WrBxXxgZpVM4X8VC', 1, 'active', 4, 7, 'Female', '0000-00-00', '311.jpg', 'Maharashtra', 'Mumbai', '400001', 'Anil Sharma', 'Engineer', 'Sunita Sharma', 'Teacher', 92.00, 89.50, '311.pdf', '311.pdf', '2026-04-22 11:03:56'),
(25, '312', 'Rahul Verma', 'rahul.v@gmail.com', '9876543212', 1, '$2b$10$XgSkse6J1h4nO/At35z./O6KgcOUNU1USOlcRz5d5L9Qi2XM9tBuG', 1, 'active', 4, 7, 'Male', '0000-00-00', '312.jpg', 'Delhi', 'New Delhi', '110001', 'Sanjay Verma', 'Doctor', 'Kavita Verma', 'Banker', 85.00, 82.50, '312.pdf', '312.pdf', '2026-04-22 11:03:57'),
(26, '313', 'Sam Master', 'sam@gmail.com', '9090909091', 1, '$2b$10$OVzWnEJBLvW56PSBjQSRXuFYUABztt3V8oP1zfR6Ili4ePVfTXqFu', 1, 'active', 1, 5, 'Male', '2003-10-10', '1776974433618.jpeg', 'Gujarat', 'Ahmedabad', '382424', 'Mukesh', 'Business', 'Malti', 'Designer', 90.00, 89.99, '1776974433643.pdf', '1776974433675.pdf', '2026-04-23 20:00:33'),
(28, '003', 'Lakshya Parihar', 'lakshyaparihar36@gmail.com', '9023367397', 1, '$2b$10$SuLyJzNTGanJg5H3wzOztuQYi4vvwAnT6fPgOLkrsGW/l4MFM.F92', 0, 'active', 1, 3, 'Male', '2004-06-15', '1777539415621.png', 'Rajasthan', 'Jodhpur', '111111', 'Jitendra Kumar', 'Teacher', 'Seema Parihar', 'Housewife', 71.00, 71.00, '1777539415669.pdf', '1777539415698.pdf', '2026-04-30 08:56:55');

-- --------------------------------------------------------

--
-- Table structure for table `student_certificates`
--

CREATE TABLE `student_certificates` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `badge_type` varchar(50) DEFAULT 'Completion',
  `issue_date` date NOT NULL,
  `verified_id` varchar(50) NOT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_certificates`
--

INSERT INTO `student_certificates` (`id`, `student_id`, `title`, `category`, `description`, `badge_type`, `issue_date`, `verified_id`, `file_url`, `created_at`) VALUES
(2, 8, 'Excellence in AI Systems', 'TECHNICAL CORE', 'Highest achieving student in Neural Networks and Deep Learning architectures.', 'EXPERTISE', '2025-12-05', 'AIA-9902', '#', '2026-03-27 19:08:34'),
(4, 8, 'Leadership in Technology', 'SOFT SKILLS', 'Recognized for outstanding project management and team leadership skills.', 'HONOR', '2026-02-28', 'AIA-3349', '#', '2026-03-27 19:08:34'),
(5, 8, 'Migration certificate ', 'General', 'Issued for: do need it cuz my  personal issue\r\n', 'Completion', '2026-03-27', 'AIA-2128', 'uploads\\certificates\\cert-1774643545913.jpg', '2026-03-27 20:32:25'),
(6, 6, 'Excellence in Flutter Systems', 'TECHNICAL CORE', 'Comprehensive completion of the advanced Flutter development.', 'Expertise', '2026-04-20', 'AIA-5846', 'uploads\\certificates\\cert-1776526982885.pdf', '2026-04-18 15:43:02'),
(7, 6, 'Migration certificate', 'General', 'Issued for: Need to relocate due to emergency.', 'Completion', '2026-04-18', 'AIA-3156', 'uploads\\certificates\\cert-1776532935795.pdf', '2026-04-18 17:22:15'),
(9, 11, 'Web Development Crash Course', 'General', 'Issued for: I have successfully completed the Web Development Crash Course from 01-02-2026 to 01-04-2026, but havent recieved the certificate yet. Can u please issue the certificate as soon as possible.', 'Completion', '2026-04-25', 'AIA-1833', 'uploads\\certificates\\cert-1777112403652.pdf', '2026-04-25 10:20:03');

-- --------------------------------------------------------

--
-- Table structure for table `student_fee_payments`
--

CREATE TABLE `student_fee_payments` (
  `id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `semester_fees` decimal(10,2) DEFAULT NULL,
  `amount_paid` decimal(10,2) DEFAULT 0.00,
  `payment_status` varchar(50) DEFAULT 'Pending',
  `transaction_id` varchar(100) DEFAULT NULL,
  `payment_date` datetime DEFAULT NULL,
  `is_locked` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_fee_payments`
--

INSERT INTO `student_fee_payments` (`id`, `student_id`, `semester`, `semester_fees`, `amount_paid`, `payment_status`, `transaction_id`, `payment_date`, `is_locked`) VALUES
(26, 10, 1, 37500.00, 37500.00, 'Paid', NULL, NULL, 1),
(27, 10, 2, 37500.00, 37500.00, 'Paid', NULL, NULL, 1),
(28, 10, 3, 37500.00, 37500.00, 'Paid', NULL, NULL, 1),
(29, 10, 4, 37500.00, 0.00, 'Pending', NULL, NULL, 1),
(30, 10, 5, 37500.00, 0.00, 'Pending', NULL, NULL, 1),
(31, 10, 6, 37500.00, 0.00, 'Pending', NULL, NULL, 1),
(32, 10, 7, 37500.00, 0.00, 'Pending', NULL, NULL, 1),
(33, 10, 8, 37500.00, 0.00, 'Pending', NULL, NULL, 1),
(34, 6, 1, 60000.00, 20000.00, 'Partial', NULL, NULL, 1),
(35, 6, 2, 60000.00, 0.00, 'Pending', NULL, NULL, 1),
(36, 6, 3, 60000.00, 0.00, 'Pending', NULL, NULL, 1),
(37, 6, 4, 60000.00, 0.00, 'Pending', NULL, NULL, 1),
(38, 8, 1, 60000.00, 60000.00, 'Paid', NULL, NULL, 1),
(39, 8, 2, 60000.00, 30000.00, 'Partial', NULL, NULL, 1),
(40, 8, 3, 60000.00, 0.00, 'Pending', NULL, NULL, 1),
(41, 8, 4, 60000.00, 0.00, 'Pending', NULL, NULL, 1),
(42, 9, 1, 60000.00, 60000.00, 'Paid', NULL, NULL, 1),
(43, 9, 2, 60000.00, 0.00, 'Pending', NULL, NULL, 1),
(44, 9, 3, 60000.00, 0.00, 'Pending', NULL, NULL, 1),
(45, 9, 4, 60000.00, 0.00, 'Pending', NULL, NULL, 1),
(46, 7, 1, 60000.00, 10000.00, 'Partial', NULL, NULL, 1),
(47, 7, 2, 60000.00, 0.00, 'Pending', NULL, NULL, 1),
(48, 7, 3, 60000.00, 0.00, 'Pending', NULL, NULL, 1),
(49, 7, 4, 60000.00, 0.00, 'Pending', NULL, NULL, 1),
(56, 11, 7, 40000.00, 0.00, 'Pending', NULL, NULL, 1),
(57, 11, 8, 40000.00, 0.00, 'Pending', NULL, NULL, 1),
(58, 11, 1, 40000.00, 20000.00, 'Partial', NULL, NULL, 1),
(59, 11, 2, 40000.00, 0.00, 'Pending', NULL, NULL, 1),
(60, 11, 3, 40000.00, 0.00, 'Pending', NULL, NULL, 1),
(61, 11, 4, 40000.00, 0.00, 'Pending', NULL, NULL, 1),
(62, 11, 5, 40000.00, 0.00, 'Pending', NULL, NULL, 1),
(63, 11, 6, 40000.00, 0.00, 'Pending', NULL, NULL, 1),
(64, 12, 1, 67500.00, 0.00, 'Pending', NULL, NULL, 1),
(65, 12, 2, 67500.00, 0.00, 'Pending', NULL, NULL, 1),
(66, 12, 3, 67500.00, 0.00, 'Pending', NULL, NULL, 1),
(67, 12, 4, 67500.00, 0.00, 'Pending', NULL, NULL, 1),
(68, 12, 5, 67500.00, 0.00, 'Pending', NULL, NULL, 1),
(69, 12, 6, 67500.00, 0.00, 'Pending', NULL, NULL, 1),
(70, 21, 1, 67500.00, 0.00, 'Pending', NULL, NULL, 1),
(71, 21, 2, 67500.00, 0.00, 'Pending', NULL, NULL, 1),
(72, 21, 3, 67500.00, 0.00, 'Pending', NULL, NULL, 1),
(73, 21, 4, 67500.00, 0.00, 'Pending', NULL, NULL, 1),
(74, 21, 5, 67500.00, 0.00, 'Pending', NULL, NULL, 1),
(75, 21, 6, 67500.00, 0.00, 'Pending', NULL, NULL, 1),
(76, 28, 1, 60000.00, 0.00, 'Pending', NULL, NULL, 1),
(77, 28, 2, 60000.00, 0.00, 'Pending', NULL, NULL, 1),
(78, 28, 3, 60000.00, 0.00, 'Pending', NULL, NULL, 1),
(79, 28, 4, 60000.00, 0.00, 'Pending', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `student_grades`
--

CREATE TABLE `student_grades` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_name` varchar(100) NOT NULL,
  `credits` int(11) NOT NULL DEFAULT 3,
  `grade_points` decimal(3,1) NOT NULL,
  `semester` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_notes`
--

CREATE TABLE `student_notes` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `timestamp` varchar(10) DEFAULT '00:00',
  `note_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_notes`
--

INSERT INTO `student_notes` (`id`, `student_id`, `course_id`, `timestamp`, `note_text`, `created_at`) VALUES
(1, 8, 1, '15:20', 'it has to be true', '2026-03-13 16:08:48'),
(2, 8, 3, '00:00', 'this is great ill be doing this as my daily notes', '2026-03-13 17:46:57');

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

CREATE TABLE `submissions` (
  `id` int(11) NOT NULL,
  `assignment_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `marks_obtained` decimal(5,2) DEFAULT NULL,
  `status` enum('submitted','late','graded') DEFAULT 'submitted'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `submissions`
--

INSERT INTO `submissions` (`id`, `assignment_id`, `student_id`, `file_url`, `submitted_at`, `marks_obtained`, `status`) VALUES
(1, 1, 6, '1773038276815.jpg', '2026-03-09 06:37:56', NULL, 'submitted'),
(2, 7, 6, '1773316453092.pdf', '2026-03-12 11:54:13', 48.00, 'graded'),
(3, 4, 11, '1773317757188.pptx', '2026-03-12 12:15:57', NULL, 'submitted'),
(4, 5, 8, '1773655494070.txt', '2026-03-16 10:04:54', 45.00, 'graded'),
(5, 6, 9, '1773658173984.pptx', '2026-03-16 10:49:34', 42.00, 'graded'),
(8, 6, 8, '1774379355659.pdf', '2026-03-24 19:09:15', 49.00, 'graded'),
(9, 5, 9, '1774381109958.pdf', '2026-03-24 19:38:29', NULL, 'submitted'),
(11, 7, 7, '7-1776497051189-232293660.pdf', '2026-04-18 07:24:11', NULL, 'submitted'),
(12, 7, 28, '28-1777549362992-739276419.pdf', '2026-04-30 11:42:43', 45.00, 'graded');

-- --------------------------------------------------------

--
-- Stand-in structure for view `unified_gradebook`
-- (See below for the actual view)
--
CREATE TABLE `unified_gradebook` (
`student_id` int(11)
,`course_id` int(11)
,`assessment_type` enum('Mid-Sem','Final-Sem','Oral','Practical')
,`score` decimal(5,2)
,`max_score` decimal(5,2)
);

-- --------------------------------------------------------

--
-- Structure for view `unified_gradebook`
--
DROP TABLE IF EXISTS `unified_gradebook`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `unified_gradebook`  AS SELECT `exam_grades`.`student_id` AS `student_id`, `exam_grades`.`course_id` AS `course_id`, `exam_grades`.`exam_type` AS `assessment_type`, `exam_grades`.`marks_obtained` AS `score`, `exam_grades`.`total_marks` AS `max_score` FROM `exam_grades` WHERE `exam_grades`.`status` = 'published' ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `branch_semester` (`branch_id`,`semester`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_attendance` (`student_id`,`course_id`,`attendance_date`),
  ADD KEY `fk_attendance_course` (`course_id`);

--
-- Indexes for table `attendance_sessions`
--
ALTER TABLE `attendance_sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `branch_code` (`branch_code`),
  ADD KEY `fk_branches_college` (`college_id`);

--
-- Indexes for table `branch_fees`
--
ALTER TABLE `branch_fees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_branch` (`branch_id`);

--
-- Indexes for table `certificate_requests`
--
ALTER TABLE `certificate_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `chat_history`
--
ALTER TABLE `chat_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `circulars`
--
ALTER TABLE `circulars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `colleges`
--
ALTER TABLE `colleges`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `college_code` (`college_code`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_id`),
  ADD UNIQUE KEY `course_code` (`course_code`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `fk_course_faculty` (`assigned_faculty_id`),
  ADD KEY `fk_course_coordinator` (`course_coordinator_id`);

--
-- Indexes for table `course_discussions`
--
ALTER TABLE `course_discussions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `course_materials`
--
ALTER TABLE `course_materials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `exam_grades`
--
ALTER TABLE `exam_grades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_exam_record` (`student_id`,`course_id`,`exam_type`),
  ADD KEY `fk_grades_course` (`course_id`);

--
-- Indexes for table `faculty`
--
ALTER TABLE `faculty`
  ADD PRIMARY KEY (`faculty_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_faculty_branch` (`branch_id`);

--
-- Indexes for table `fee_transactions`
--
ALTER TABLE `fee_transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `faculty_id` (`faculty_id`);

--
-- Indexes for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indexes for table `quiz_results`
--
ALTER TABLE `quiz_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_date_range` (`date`,`start_time`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `enrollment_no` (`enrollment_no`),
  ADD KEY `fk_students_college` (`college_id`),
  ADD KEY `fk_students_branches` (`branch_id`);

--
-- Indexes for table `student_certificates`
--
ALTER TABLE `student_certificates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `student_fee_payments`
--
ALTER TABLE `student_fee_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `student_grades`
--
ALTER TABLE `student_grades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `student_notes`
--
ALTER TABLE `student_notes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assignment_id` (`assignment_id`),
  ADD KEY `student_id` (`student_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `attendance_sessions`
--
ALTER TABLE `attendance_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `branch_fees`
--
ALTER TABLE `branch_fees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `certificate_requests`
--
ALTER TABLE `certificate_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `chapters`
--
ALTER TABLE `chapters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `chat_history`
--
ALTER TABLE `chat_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `circulars`
--
ALTER TABLE `circulars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `colleges`
--
ALTER TABLE `colleges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `course_discussions`
--
ALTER TABLE `course_discussions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `course_materials`
--
ALTER TABLE `course_materials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `exam_grades`
--
ALTER TABLE `exam_grades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `faculty`
--
ALTER TABLE `faculty`
  MODIFY `faculty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `fee_transactions`
--
ALTER TABLE `fee_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `quiz_results`
--
ALTER TABLE `quiz_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=149;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `student_certificates`
--
ALTER TABLE `student_certificates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `student_fee_payments`
--
ALTER TABLE `student_fee_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `student_grades`
--
ALTER TABLE `student_grades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `student_notes`
--
ALTER TABLE `student_notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `submissions`
--
ALTER TABLE `submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE;

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `fk_attendance_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_attendance_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `branches`
--
ALTER TABLE `branches`
  ADD CONSTRAINT `fk_branches_college` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `branch_fees`
--
ALTER TABLE `branch_fees`
  ADD CONSTRAINT `branch_fees_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certificate_requests`
--
ALTER TABLE `certificate_requests`
  ADD CONSTRAINT `certificate_requests_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chapters`
--
ALTER TABLE `chapters`
  ADD CONSTRAINT `chapters_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_history`
--
ALTER TABLE `chat_history`
  ADD CONSTRAINT `chat_history_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_course_coordinator` FOREIGN KEY (`course_coordinator_id`) REFERENCES `faculty` (`faculty_id`) ON DELETE SET NULL;

--
-- Constraints for table `course_discussions`
--
ALTER TABLE `course_discussions`
  ADD CONSTRAINT `course_discussions_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_discussions_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `course_materials`
--
ALTER TABLE `course_materials`
  ADD CONSTRAINT `course_materials_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE;

--
-- Constraints for table `exam_grades`
--
ALTER TABLE `exam_grades`
  ADD CONSTRAINT `fk_grades_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_grades_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `faculty`
--
ALTER TABLE `faculty`
  ADD CONSTRAINT `fk_faculty_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quizzes_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`faculty_id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD CONSTRAINT `quiz_questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_results`
--
ALTER TABLE `quiz_results`
  ADD CONSTRAINT `quiz_results_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quiz_results_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `fk_students_branches` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_students_college` FOREIGN KEY (`college_id`) REFERENCES `colleges` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `student_certificates`
--
ALTER TABLE `student_certificates`
  ADD CONSTRAINT `student_certificates_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_fee_payments`
--
ALTER TABLE `student_fee_payments`
  ADD CONSTRAINT `student_fee_payments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_grades`
--
ALTER TABLE `student_grades`
  ADD CONSTRAINT `student_grades_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
