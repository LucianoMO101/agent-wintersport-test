-- Maak een nieuwe database
CREATE DATABASE WintersportDB;
GO


-- Maak een tabel voor accommodaties
CREATE TABLE Accommodaties (
    Id INT IDENTITY PRIMARY KEY,
    Naam NVARCHAR(100),
    Details NVARCHAR(MAX) CHECK (ISJSON(Details) = 1)
);
GO
