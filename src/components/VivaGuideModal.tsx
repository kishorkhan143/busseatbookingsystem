import React, { useState } from 'react';
import { BookOpen, Code, Database, ChevronDown, ChevronRight, CheckCircle2, ShieldCheck, Terminal, Layers, FileCode } from 'lucide-react';

export const VivaGuideModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'viva' | 'classes' | 'transactions' | 'schema'>('viva');
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(0);

  const vivaQuestions = [
    {
      q: '1. What are the key OOP concepts demonstrated in SeatEase?',
      a: 'SeatEase naturally implements: Encapsulation (private fields in Seat, Customer, Booking with public getters/setters), Composition (Booking HAS-A Customer and HAS-A list of Seats), Abstraction (decoupling HTTP handling in Controller, business rules in Service, and SQL operations in DAO), and Exception Handling (custom propagation of IllegalArgumentException and SQLException).',
    },
    {
      q: '2. Why did you use PreparedStatement instead of Statement?',
      a: 'PreparedStatement compiles the SQL query once on the database engine and substitutes parameters using placeholders (?). This delivers two major benefits: 1) Prevention of SQL Injection attacks by automatically escaping user inputs, and 2) Query performance optimization via execution plan caching.',
    },
    {
      q: '3. How does SeatEase prevent two concurrent users from booking the same seat?',
      a: 'We use JDBC ACID Transactions with Pessimistic Locking. Before confirming, BookingService begins a transaction (conn.setAutoCommit(false)) and executes "SELECT seat_id, price, status FROM seats WHERE seat_id IN (...) FOR UPDATE;". MySQL locks those candidate rows, preventing any other concurrent transaction from modifying or booking them until our transaction either commits or rolls back.',
    },
    {
      q: '4. What is the role of the DAO (Data Access Object) pattern?',
      a: 'The DAO pattern isolates database persistence logic from business logic. SeatDAO, CustomerDAO, BookingDAO, and BookingSeatDAO contain SQL queries and JDBC result mapping only. If the database engine ever changes, only the DAO package needs revision, leaving business rules intact.',
    },
    {
      q: '5. Why is the total fare calculated on the Java backend instead of trusting React?',
      a: 'Frontend code runs in the user\'s client browser and can be modified or manipulated using developer tools or custom HTTP payloads. Computing "seatCount * 150.00" inside BookingService guarantees financial integrity and prevents fare tampering.',
    },
    {
      q: '6. What is the purpose of the booking_seats junction table?',
      a: 'A single booking can contain multiple seats (e.g. A1, A2), and a seat can be booked multiple times across different historical bookings over time (after cancellation). A Many-to-Many relationship cannot be represented cleanly in a single table, so booking_seats decomposes it into two One-to-Many relationships with a composite primary key (booking_id, seat_id).',
    },
    {
      q: '7. What HTTP server did you use in the backend?',
      a: 'We used Java\'s built-in "com.sun.net.httpserver.HttpServer". It is bundled directly with Java 17 standard edition (SE) and requires zero external enterprise frameworks like Spring Boot or Apache Tomcat, making our mini project pure Java and quick to compile.',
    },
    {
      q: '8. What happens during a transaction rollback in BookingService?',
      a: 'If any selected seat is already BOOKED, or if a database crash occurs during customer or booking insertion, the catch block triggers conn.rollback(). This undoes all uncommitted inserts or updates within that transaction, guaranteeing the database never has orphan or half-created records.',
    },
    {
      q: '9. How does cancellation work without losing booking history?',
      a: 'Instead of executing "DELETE FROM bookings", SeatEase executes an "UPDATE bookings SET booking_status = \'CANCELLED\' WHERE booking_id = ?" and updates the corresponding seats back to "AVAILABLE". This preserves historical auditing records while freeing seats for new passengers.',
    },
    {
      q: '10. What does the Gson library do in this project?',
      a: 'Gson converts incoming HTTP request JSON string payloads into Java objects (e.g. parsing JSON to String name, mobile, and List<String> seatIds), and serializes Java models (Seat, Customer, Booking) back into JSON responses sent to the React frontend.',
    },
  ];

  const classExplanations = [
    {
      name: 'Seat.java',
      pkg: 'com.seatease.model',
      concept: 'Encapsulation & Entity Modeling',
      desc: 'Encapsulates seat attributes (seatId, rowName, seatNumber, price, status) with private access modifiers and public getters/setters. Provides helper method isAvailable().',
    },
    {
      name: 'Customer.java',
      pkg: 'com.seatease.model',
      concept: 'Encapsulation & Domain Model',
      desc: 'Stores passenger information (customerId, name, mobile, email). Constructor overloading allows creation before and after database auto-increment ID generation.',
    },
    {
      name: 'Booking.java',
      pkg: 'com.seatease.model',
      concept: 'Composition (HAS-A Relationship)',
      desc: 'Demonstrates OOP Composition: a Booking contains a Customer object and a List<Seat> collection, representing an atomic booking transaction with totalAmount and timestamp.',
    },
    {
      name: 'DatabaseConnection.java',
      pkg: 'com.seatease.database',
      concept: 'Abstraction & Singleton/Utility Pattern',
      desc: 'Encapsulates the JDBC DriverManager configuration, reading credentials safely from environment variables (DB_URL, DB_USERNAME, DB_PASSWORD) with a private constructor.',
    },
    {
      name: 'SeatDAO.java & BookingDAO.java',
      pkg: 'com.seatease.dao',
      concept: 'Data Access Object Pattern',
      desc: 'Encapsulates all raw JDBC PreparedStatements and SQL operations. Allows passing external transaction Connection objects to participate in atomic units of work.',
    },
    {
      name: 'BookingService.java',
      pkg: 'com.seatease.service',
      concept: 'Business Logic & ACID Transactions',
      desc: 'Coordinates the entire booking workflow: validates inputs, initiates conn.setAutoCommit(false), locks rows using SELECT ... FOR UPDATE, enforces seat availability, calculates amount, and commits.',
    },
    {
      name: 'Main.java',
      pkg: 'com.seatease.main',
      concept: 'Entry Point & Concurrency',
      desc: 'Bootstraps com.sun.net.httpserver.HttpServer on port 8080, registers /api/seats and /api/bookings endpoints, configures a thread pool executor, and enables CORS.',
    },
  ];

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>College Evaluation &amp; Viva Companion</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Java OOP Architecture &amp; Viva Preparation
        </h1>
        <p className="text-sm text-slate-300 mt-1">
          Complete guide explaining the Java classes, design patterns, MySQL schema, and examiners&apos; top questions.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab('viva')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'viva'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Viva Q&amp;A (Top 10)
        </button>
        <button
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'classes'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Java Classes &amp; OOP Role
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'transactions'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          ACID Transaction Trace
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'schema'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          MySQL Tables &amp; DDL
        </button>
      </div>

      {/* Content: Viva Q&A */}
      {activeTab === 'viva' && (
        <div className="space-y-3">
          {vivaQuestions.map((item, idx) => {
            const isOpen = openQuestionIndex === idx;

            return (
              <div
                key={idx}
                className="bg-[#111C2E] border border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenQuestionIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/40 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-white flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 text-xs flex items-center justify-center font-black border border-cyan-800">
                      Q{idx + 1}
                    </span>
                    {item.q.replace(/^\d+\.\s*/, '')}
                  </span>
                  {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/40">
                    <div className="flex items-start gap-2 pt-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-emerald-400 font-semibold">Model Viva Answer: </strong>
                        <span>{item.a}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Content: Java Classes */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classExplanations.map((cls, idx) => (
            <div
              key={idx}
              className="bg-[#111C2E] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-mono font-bold text-white text-sm">{cls.name}</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {cls.pkg}
                  </span>
                </div>
                <div className="inline-block px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 text-[11px] font-semibold mb-2.5">
                  {cls.concept}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{cls.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Java 17 Standard Edition</span>
                <span>com.seatease</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content: ACID Transactions */}
      {activeTab === 'transactions' && (
        <div className="bg-[#111C2E] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Pessimistic Locking &amp; ACID Transaction Workflow
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Visualizes the exact sequence executed by <code className="text-cyan-300">BookingService.java</code> during seat confirmation.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500">// Step 1: Start Transaction</span>
              <p className="text-cyan-300 font-bold mt-1">conn.setAutoCommit(false);</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-900/60">
              <span className="text-slate-500">// Step 2: Lock candidate rows (Pessimistic Row Lock)</span>
              <p className="text-amber-300 font-bold mt-1">
                SELECT seat_id, price, status FROM seats WHERE seat_id IN (&apos;A1&apos;, &apos;A2&apos;) FOR UPDATE;
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                * Prevents any other transaction from reserving A1/A2 until commit or rollback.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500">// Step 3: Insert Customer record</span>
              <p className="text-white mt-1">
                INSERT INTO customers (name, mobile, email) VALUES (?, ?, ?);
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500">// Step 4: Insert Booking record</span>
              <p className="text-white mt-1">
                INSERT INTO bookings (customer_id, total_amount, booking_status) VALUES (?, 300.00, &apos;CONFIRMED&apos;);
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500">// Step 5: Map seats in junction table</span>
              <p className="text-white mt-1">
                INSERT INTO booking_seats (booking_id, seat_id) VALUES (1, &apos;A1&apos;), (1, &apos;A2&apos;);
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500">// Step 6: Mark seats as BOOKED</span>
              <p className="text-white mt-1">
                UPDATE seats SET status = &apos;BOOKED&apos; WHERE seat_id IN (&apos;A1&apos;, &apos;A2&apos;);
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-900/60">
              <span className="text-slate-500">// Step 7: Commit changes atomically</span>
              <p className="text-emerald-400 font-bold mt-1">conn.commit();</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-rose-950">
              <span className="text-slate-500">// If any step fails or conflict occurs:</span>
              <p className="text-rose-400 font-bold mt-1">conn.rollback();</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Guarantees zero partial records or phantom bookings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content: Database Schema */}
      {activeTab === 'schema' && (
        <div className="bg-[#111C2E] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                Database: seatease_db (MySQL 8.0+)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Located at: <code className="text-cyan-300">backend/src/main/resources/schema.sql</code>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* seats table */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
              <p className="font-bold text-cyan-400 mb-2 font-mono">TABLE: seats</p>
              <ul className="space-y-1 text-slate-300 font-mono">
                <li><span className="text-amber-400 font-bold">seat_id</span> VARCHAR(5) PRIMARY KEY</li>
                <li>row_name VARCHAR(1) NOT NULL</li>
                <li>seat_number INT NOT NULL</li>
                <li>price DECIMAL(10,2) NOT NULL</li>
                <li>status VARCHAR(20) DEFAULT &apos;AVAILABLE&apos;</li>
              </ul>
            </div>

            {/* customers table */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
              <p className="font-bold text-cyan-400 mb-2 font-mono">TABLE: customers</p>
              <ul className="space-y-1 text-slate-300 font-mono">
                <li><span className="text-amber-400 font-bold">customer_id</span> INT PRIMARY KEY AUTO_INCREMENT</li>
                <li>name VARCHAR(100) NOT NULL</li>
                <li>mobile VARCHAR(10) NOT NULL</li>
                <li>email VARCHAR(150)</li>
              </ul>
            </div>

            {/* bookings table */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
              <p className="font-bold text-cyan-400 mb-2 font-mono">TABLE: bookings</p>
              <ul className="space-y-1 text-slate-300 font-mono">
                <li><span className="text-amber-400 font-bold">booking_id</span> INT PRIMARY KEY AUTO_INCREMENT</li>
                <li>customer_id INT (FK &rarr; customers)</li>
                <li>total_amount DECIMAL(10,2) NOT NULL</li>
                <li>booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP</li>
                <li>booking_status VARCHAR(20) DEFAULT &apos;CONFIRMED&apos;</li>
              </ul>
            </div>

            {/* booking_seats junction table */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
              <p className="font-bold text-cyan-400 mb-2 font-mono">TABLE: booking_seats (Junction)</p>
              <ul className="space-y-1 text-slate-300 font-mono">
                <li><span className="text-amber-400 font-bold">booking_id</span> INT (FK &rarr; bookings)</li>
                <li><span className="text-amber-400 font-bold">seat_id</span> VARCHAR(5) (FK &rarr; seats)</li>
                <li>PRIMARY KEY (booking_id, seat_id)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
